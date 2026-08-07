/**
 * table.js — render tabel Transaksi: search, filter rentang tanggal,
 * filter status, sorting per kolom, dan pagination.
 */
const tableState = {
  all: [],
  filtered: [],
  page: 1,
  pageSize: 8,
  sortKey: 'date',
  sortDir: 'desc',
};

function formatRupiah(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function applyTableFilters() {
  const q = (document.getElementById('tableSearch')?.value || '').toLowerCase().trim();
  const from = document.getElementById('dateFrom')?.value;
  const to = document.getElementById('dateTo')?.value;
  const status = document.getElementById('statusFilter')?.value;

  let rows = tableState.all.filter((t) => {
    const matchQ = !q || t.id.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.product.toLowerCase().includes(q);
    const matchFrom = !from || t.date >= from;
    const matchTo = !to || t.date <= to;
    const matchStatus = !status || status === 'all' || t.status === status;
    return matchQ && matchFrom && matchTo && matchStatus;
  });

  rows = rows.sort((a, b) => {
    let va = a[tableState.sortKey], vb = b[tableState.sortKey];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return tableState.sortDir === 'asc' ? -1 : 1;
    if (va > vb) return tableState.sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  tableState.filtered = rows;
  tableState.page = 1;
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  const info = document.getElementById('tableInfo');
  const pag = document.getElementById('pagination');
  if (!tbody) return;

  const total = tableState.filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / tableState.pageSize));
  tableState.page = Math.min(tableState.page, totalPages);

  const start = (tableState.page - 1) * tableState.pageSize;
  const pageRows = tableState.filtered.slice(start, start + tableState.pageSize);

  if (pageRows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">Tidak ada transaksi yang cocok dengan pencarian / filter.</div></td></tr>`;
  } else {
    tbody.innerHTML = pageRows.map((t) => `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${formatDate(t.date)}</td>
        <td>${t.customer}</td>
        <td>${t.product}</td>
        <td>${t.qty}</td>
        <td>${formatRupiah(t.total)}</td>
        <td><span class="status-pill ${t.status === 'Lunas' ? 'status-lunas' : 'status-pending'}">${t.status}</span></td>
      </tr>
    `).join('');
  }

  if (info) info.textContent = total === 0
    ? 'Menampilkan 0 transaksi'
    : `Menampilkan ${start + 1}–${Math.min(start + tableState.pageSize, total)} dari ${total} transaksi`;

  if (pag) {
    let html = `<button ${tableState.page === 1 ? 'disabled' : ''} data-page="prev">‹</button>`;
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages > 7 && Math.abs(p - tableState.page) > 2 && p !== 1 && p !== totalPages) {
        if (p === 2 || p === totalPages - 1) html += `<span style="padding:0 4px;color:var(--text-faint)">…</span>`;
        continue;
      }
      html += `<button class="${p === tableState.page ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    html += `<button ${tableState.page === totalPages ? 'disabled' : ''} data-page="next">›</button>`;
    pag.innerHTML = html;

    pag.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = btn.dataset.page;
        if (d === 'prev') tableState.page = Math.max(1, tableState.page - 1);
        else if (d === 'next') tableState.page = Math.min(totalPages, tableState.page + 1);
        else tableState.page = parseInt(d, 10);
        renderTable();
      });
    });
  }
}

function initTable(transactions) {
  tableState.all = transactions;
  tableState.filtered = transactions;

  document.getElementById('tableSearch')?.addEventListener('input', applyTableFilters);
  document.getElementById('dateFrom')?.addEventListener('change', applyTableFilters);
  document.getElementById('dateTo')?.addEventListener('change', applyTableFilters);
  document.getElementById('statusFilter')?.addEventListener('change', applyTableFilters);
  document.getElementById('resetFilters')?.addEventListener('click', () => {
    document.getElementById('tableSearch').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('statusFilter').value = 'all';
    applyTableFilters();
  });

  document.querySelectorAll('.data-table thead th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (tableState.sortKey === key) {
        tableState.sortDir = tableState.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        tableState.sortKey = key;
        tableState.sortDir = 'asc';
      }
      applyTableFilters();
    });
  });

  renderTable();
}
