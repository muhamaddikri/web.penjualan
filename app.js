/**
 * app.js — Inisialisasi utama dashboard.html
 */

function formatCompactRupiah(n) {
  if (n >= 1000000000) return 'Rp ' + (n / 1000000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1).replace('.0', '') + 'jt';
  return formatRupiah(n);
}

function renderSummary(transactions) {
  const totalSales = transactions.reduce((s, t) => s + t.total, 0);
  const totalTrx = transactions.length;
  const avgTrx = totalTrx ? Math.round(totalSales / totalTrx) : 0;

  const productCount = {};
  transactions.forEach((t) => { productCount[t.product] = (productCount[t.product] || 0) + t.qty; });
  const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('sumTotalSales').textContent = formatCompactRupiah(totalSales);
  document.getElementById('sumTotalTrx').textContent = totalTrx.toLocaleString('id-ID');
  document.getElementById('sumAvgTrx').textContent = formatCompactRupiah(avgTrx);
  document.getElementById('sumTopProduct').textContent = topProduct ? topProduct[0] : '-';
  document.getElementById('sumTopProductQty').textContent = topProduct ? `${topProduct[1]} unit terjual` : '';
}

function renderRecentTable(transactions) {
  const tbody = document.getElementById('recentTableBody');
  if (!tbody) return;
  const recent = transactions.slice(0, 5);
  tbody.innerHTML = recent.map((t) => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td>${formatDate(t.date)}</td>
      <td>${t.customer}</td>
      <td>${t.product}</td>
      <td>${formatRupiah(t.total)}</td>
      <td><span class="status-pill ${t.status === 'Lunas' ? 'status-lunas' : 'status-pending'}">${t.status}</span></td>
    </tr>
  `).join('');
}

function renderProductReport(transactions) {
  const map = {};
  transactions.forEach((t) => {
    if (!map[t.product]) map[t.product] = { name: t.product, category: t.category, qty: 0, total: 0 };
    map[t.product].qty += t.qty;
    map[t.product].total += t.total;
  });
  const products = Object.values(map).sort((a, b) => b.total - a.total);
  const maxTotal = products[0]?.total || 1;

  const el = document.getElementById('productRankList');
  if (el) {
    el.innerHTML = products.map((p, i) => `
      <div class="rank-item">
        <div class="rank-num">${i + 1}</div>
        <div class="info">
          <div class="name">${p.name}</div>
          <div class="meta">${p.category} • ${p.qty} unit terjual</div>
          <div class="progress-track"><div class="progress-fill" style="width:${Math.round((p.total / maxTotal) * 100)}%"></div></div>
        </div>
        <div class="value">${formatCompactRupiah(p.total)}</div>
      </div>
    `).join('');
  }

  // Kartu ringkasan produk
  document.getElementById('prodTotalItems').textContent = products.length;
  const bestCat = {};
  transactions.forEach((t) => { bestCat[t.category] = (bestCat[t.category] || 0) + t.total; });
  const topCat = Object.entries(bestCat).sort((a, b) => b[1] - a[1])[0];
  document.getElementById('prodTopCategory').textContent = topCat ? topCat[0] : '-';
  const totalUnits = transactions.reduce((s, t) => s + t.qty, 0);
  document.getElementById('prodTotalUnits').textContent = totalUnits.toLocaleString('id-ID');
}

/* --- Navigasi antar-view (Dashboard / Laporan Produk / Transaksi / Pengaturan) --- */
function initNav() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.view;

      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
      document.getElementById('view-' + target)?.classList.add('active');

      document.getElementById('pageTitle').textContent = link.dataset.title || link.textContent.trim();

      closeSidebarMobile();
    });
  });
}

function openSidebarMobile() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('show');
}
function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

function initSidebarToggle() {
  document.getElementById('hamburgerBtn')?.addEventListener('click', openSidebarMobile);
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebarMobile);
}

/* --- Settings view: theme switch buttons & logout --- */
function initSettings() {
  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      syncThemeButtons();
    });
  });
  syncThemeButtons();

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (confirm('Yakin ingin keluar?')) logoutUser();
  });
  document.getElementById('logoutBtnSidebar')?.addEventListener('click', () => {
    if (confirm('Yakin ingin keluar?')) logoutUser();
  });
}

function syncThemeButtons() {
  const current = document.documentElement.getAttribute('data-theme');
  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === current);
  });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  initTheme();
  initSidebarToggle();
  initNav();
  initSettings();
  initExportButtons();

  const uName = getUserName();
  document.getElementById('userNameLabel').textContent = uName;
  document.getElementById('userInitial').textContent = uName.charAt(0).toUpperCase();
  document.getElementById('userInitial2').textContent = uName.charAt(0).toUpperCase();
  const acctNameEl = document.getElementById('acctName');
  if (acctNameEl) acctNameEl.textContent = uName;

  const transactions = await getTransactions();
  window.__lastTransactions = transactions;

  renderSummary(transactions);
  renderCharts(transactions);
  renderRecentTable(transactions);
  renderProductReport(transactions);
  initTable(transactions);
});
