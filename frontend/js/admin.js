/* ===================================================================
   RENTORA – ADMIN CONSOLE CONTROLLER
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const user = getAuthUser();
  if (!user || user.role !== 'admin') {
    window.location.href = '/login.html?redirect=/admin-dashboard.html';
    return;
  }

  loadAdminOverview();
  loadAdminEscalations();
  loadAdminUsers();
});

async function loadAdminOverview() {
  try {
    const data = await apiRequest('/admin/stats');
    const s = data.stats;

    document.getElementById('adm-total-users').textContent = s.totalUsers;
    document.getElementById('adm-active-rentals').textContent = s.activeRentals;
    document.getElementById('adm-overdue-rentals').textContent = s.overdueRentals;
    document.getElementById('adm-total-gmv').textContent = formatCurrency(s.totalGrossVolume);
    document.getElementById('adm-platform-cut').textContent = formatCurrency(s.platformEarnings);
    document.getElementById('adm-total-orders').textContent = s.totalOrders;
  } catch (err) {
    showToast('Failed to load admin metrics: ' + err.message, 'error');
  }
}

// Load Escalations and Overdue Rentals
async function loadAdminEscalations() {
  const tableBody = document.getElementById('admin-escalations-table-body');
  if (!tableBody) return;

  try {
    const data = await apiRequest('/admin/rentals?escalated=true');
    const rentals = data.rentals || [];

    if (rentals.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--accent-emerald);">
            <i class="fas fa-shield-alt" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            All clear! No overdue rental escalations or disputes pending.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = rentals
      .map((r) => {
        const prod = r.product || {};
        const cust = r.customer || {};
        const sel = r.seller || {};

        return `
          <tr>
            <td><strong style="color: var(--accent-rose);">#${r.rentalNumber}</strong></td>
            <td>
              <div style="font-weight: 700; color: #fff;">${prod.title || 'Product'}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Seller: ${sel.name || ''}</div>
            </td>
            <td>
              <div style="font-weight: 600; color: #fff;">${cust.name || 'Customer'}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${cust.email || ''} | ${cust.phone || ''}</div>
            </td>
            <td>
              <span class="badge badge-overdue"><i class="fas fa-exclamation-triangle"></i> OVERDUE</span>
              <div style="font-size: 0.8rem; color: var(--accent-rose); font-weight: 700; margin-top: 0.2rem;">Late Fee: ${formatCurrency(r.accumulatedLateFee)}</div>
            </td>
            <td>
              <div style="font-size: 0.85rem; color: var(--text-muted); max-width: 250px;">${r.adminNotes || 'Overdue product requires admin contact.'}</div>
            </td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="openResolveEscalationModal('${r._id}')">
                <i class="fas fa-gavel"></i> Intervene
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Resolve Escalation Modal
let activeEscalationRentalId = null;

function openResolveEscalationModal(rentalId) {
  activeEscalationRentalId = rentalId;
  const modal = document.getElementById('resolve-escalation-modal');
  if (modal) modal.classList.add('active');
}

async function submitAdminResolution() {
  if (!activeEscalationRentalId) return;

  const notes = document.getElementById('escalation-notes')?.value.trim();
  const newStatus = document.getElementById('escalation-status')?.value || 'returned';

  try {
    const res = await apiRequest(`/admin/rentals/${activeEscalationRentalId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({
        adminNotes: notes || 'Admin intervention completed and resolved with customer & seller.',
        newStatus,
      }),
    });

    showToast(res.message, 'success');
    document.getElementById('resolve-escalation-modal')?.classList.remove('active');
    loadAdminOverview();
    loadAdminEscalations();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Load Users
async function loadAdminUsers() {
  const tableBody = document.getElementById('admin-users-table-body');
  if (!tableBody) return;

  try {
    const data = await apiRequest('/admin/users');
    const users = data.users || [];

    tableBody.innerHTML = users
      .map((u) => {
        const joinDate = new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
        
        let roleBadge = '<span class="badge badge-both">Customer</span>';
        if (u.role === 'seller') roleBadge = '<span class="badge badge-rent">Seller</span>';
        if (u.role === 'admin') roleBadge = '<span class="badge badge-sell">Admin</span>';

        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.8rem;">
                <img src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <div style="font-weight: 700; color: #fff;">${u.name}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${u.email}</div>
                </div>
              </div>
            </td>
            <td>${roleBadge}</td>
            <td>${joinDate}</td>
            <td>${u.address?.city || 'India'}</td>
            <td>
              <select class="form-control" style="padding: 0.3rem 0.6rem; font-size: 0.85rem; width: auto;" onchange="changeUserRole('${u._id}', this.value)">
                <option value="customer" ${u.role === 'customer' ? 'selected' : ''}>Customer</option>
                <option value="seller" ${u.role === 'seller' ? 'selected' : ''}>Seller</option>
                <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
              </select>
            </td>
          </tr>
        `;
      })
      .join('');
  } catch (err) {
    console.error('Failed to load users:', err);
  }
}

async function changeUserRole(userId, newRole) {
  try {
    const res = await apiRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
    });
    showToast(res.message, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}
