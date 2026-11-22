/* ===================================================================
   RENTORA – CUSTOMER DASHBOARD & RENTALS MANAGER
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const user = getAuthUser();
  if (!user) {
    window.location.href = '/login.html?redirect=/customer-dashboard.html';
    return;
  }

  // Populate user header
  const userNameEl = document.getElementById('dash-customer-name');
  const userEmailEl = document.getElementById('dash-customer-email');
  const userAvatarEl = document.getElementById('dash-customer-avatar');
  if (userNameEl) userNameEl.textContent = user.name;
  if (userEmailEl) userEmailEl.textContent = user.email;
  if (userAvatarEl && user.avatar) userAvatarEl.src = user.avatar;

  loadCustomerRentals();
  loadCustomerOrders();
  loadCustomerWishlist();
});

// Format countdown remaining
function getDaysRemaining(endDateStr) {
  const now = new Date();
  const end = new Date(endDateStr);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { isOverdue: true, text: `${Math.abs(diffDays)}d Overdue!` };
  } else if (diffDays === 0) {
    return { isOverdue: false, text: 'Due Today!' };
  } else {
    return { isOverdue: false, text: `${diffDays} days left` };
  }
}

// Load Customer Rentals
async function loadCustomerRentals() {
  const rentalsTableBody = document.getElementById('customer-rentals-table-body');
  const activeCountEl = document.getElementById('dash-metric-active-rentals');
  const overdueCountEl = document.getElementById('dash-metric-overdue-rentals');

  if (!rentalsTableBody) return;

  try {
    const data = await apiRequest('/rentals/my-rentals');
    const rentals = data.rentals || [];

    const activeRentals = rentals.filter((r) => r.status === 'active');
    const overdueRentals = rentals.filter((r) => r.status === 'overdue');

    if (activeCountEl) activeCountEl.textContent = activeRentals.length;
    if (overdueCountEl) overdueCountEl.textContent = overdueRentals.length;

    if (rentals.length === 0) {
      rentalsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            <i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            You haven't rented any equipment yet. Explore the marketplace to get started!
          </td>
        </tr>
      `;
      return;
    }

    rentalsTableBody.innerHTML = rentals
      .map((r) => {
        const prod = r.product || {};
        const image = prod.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80';
        const startStr = new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
        const endStr = new Date(r.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
        const countdown = getDaysRemaining(r.endDate);

        let statusBadge = `<span class="badge badge-${r.status}">${r.status.replace('_', ' ').toUpperCase()}</span>`;
        if (r.status === 'active' || r.status === 'overdue') {
          const urgentClass = countdown.isOverdue ? 'urgent' : 'normal';
          statusBadge += ` <span class="return-countdown-box ${urgentClass}"><i class="fas fa-stopwatch"></i> ${countdown.text}</span>`;
        }

        let actionButtons = '';
        if (r.status === 'active') {
          actionButtons = `
            <button class="btn btn-secondary btn-sm" onclick="initiateReturn('${r._id}', '${prod.title}')" title="Return Product">
              <i class="fas fa-undo"></i> Return
            </button>
            ${prod.buyPrice > 0 ? `
              <button class="btn btn-accent btn-sm" onclick="openConvertModal('${r._id}')" title="Try Before You Buy Conversion">
                <i class="fas fa-magic"></i> Buy
              </button>
            ` : ''}
          `;
        } else if (r.status === 'return_requested') {
          actionButtons = `<span style="font-size: 0.8rem; color: var(--accent-cyan);"><i class="fas fa-shipping-fast"></i> Pickup Pending</span>`;
        } else if (r.status === 'overdue') {
          actionButtons = `
            <button class="btn btn-secondary btn-sm" onclick="initiateReturn('${r._id}', '${prod.title}')" style="border-color: var(--accent-rose); color: var(--accent-rose);">
              <i class="fas fa-undo"></i> Return Now
            </button>
          `;
        } else if (r.status === 'converted_to_purchase') {
          actionButtons = `<span style="font-size: 0.8rem; color: var(--accent-emerald);"><i class="fas fa-check-circle"></i> Owned Permanently</span>`;
        } else {
          actionButtons = `<span style="font-size: 0.8rem; color: var(--text-dim);">Completed</span>`;
        }

        return `
          <tr>
            <td><strong>#${r.rentalNumber}</strong></td>
            <td>
              <div class="table-product-cell">
                <img src="${image}" alt="${prod.title || 'Product'}" class="table-product-thumb" />
                <div>
                  <a href="/product-details.html?id=${prod._id}" style="font-weight: 700; color: #fff;">${prod.title || 'Product'}</a>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${prod.category || ''}</div>
                </div>
              </div>
            </td>
            <td>
              <div>${startStr} to</div>
              <div style="font-weight: 600; color: #fff;">${endStr}</div>
            </td>
            <td>
              <div style="font-weight: 700; color: #fff;">${formatCurrency(r.totalRentalCost)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Dep: ${formatCurrency(r.securityDeposit)}</div>
              ${r.accumulatedLateFee > 0 ? `<div style="font-size: 0.8rem; color: var(--accent-rose); font-weight: 700;">Late fee: ${formatCurrency(r.accumulatedLateFee)}</div>` : ''}
            </td>
            <td>${statusBadge}</td>
            <td>
              <div class="table-action-btns">
                ${actionButtons}
              </div>
            </td>
          </tr>
        `;
      })
      .join('');
  } catch (err) {
    showToast('Failed to load rentals: ' + err.message, 'error');
  }
}

// Initiate Return Handler
async function initiateReturn(rentalId, productTitle) {
  if (!confirm(`Are you ready to initiate return for "${productTitle}"? Our logistics courier will schedule doorstep pickup.`)) {
    return;
  }

  try {
    const res = await apiRequest(`/rentals/${rentalId}/return`, {
      method: 'POST',
    });
    showToast(res.message, 'success');
    loadCustomerRentals();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Try-Before-You-Buy Convert Modal
let activeConvertRental = null;

async function openConvertModal(rentalId) {
  try {
    const data = await apiRequest('/rentals/my-rentals');
    const rental = data.rentals.find((r) => r._id === rentalId);
    if (!rental) return;

    activeConvertRental = rental;
    const modal = document.getElementById('convert-purchase-modal');
    if (!modal) return;

    const prod = rental.product;
    const fullPrice = prod.buyPrice || 0;
    const credit = rental.totalRentalCost + rental.securityDeposit;
    const balanceToPay = Math.max(0, fullPrice - credit);

    document.getElementById('convert-prod-title').textContent = prod.title;
    document.getElementById('convert-buy-price').textContent = formatCurrency(fullPrice);
    document.getElementById('convert-rental-credit').textContent = `-${formatCurrency(rental.totalRentalCost)}`;
    document.getElementById('convert-deposit-credit').textContent = `-${formatCurrency(rental.securityDeposit)}`;
    document.getElementById('convert-balance-pay').textContent = formatCurrency(balanceToPay);

    modal.classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function confirmConversionToPurchase() {
  if (!activeConvertRental) return;

  const confirmBtn = document.getElementById('confirm-convert-btn');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting Ownership...';
  }

  try {
    const res = await apiRequest(`/rentals/${activeConvertRental._id}/convert-to-purchase`, {
      method: 'POST',
    });

    showToast(res.message, 'success');
    document.getElementById('convert-purchase-modal')?.classList.remove('active');
    loadCustomerRentals();
    loadCustomerOrders();
  } catch (err) {
    showToast(err.message, 'error');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = 'Confirm Purchase & Keep Forever';
    }
  }
}

// Load Outright Orders
async function loadCustomerOrders() {
  const ordersTableBody = document.getElementById('customer-orders-table-body');
  const ordersCountEl = document.getElementById('dash-metric-total-orders');
  if (!ordersTableBody) return;

  try {
    const data = await apiRequest('/orders/my-orders');
    const orders = data.orders || [];

    if (ordersCountEl) ordersCountEl.textContent = orders.length;

    if (orders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No direct purchase orders yet.
          </td>
        </tr>
      `;
      return;
    }

    ordersTableBody.innerHTML = orders
      .map((ord) => {
        const item = ord.items?.[0] || {};
        const dateStr = new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

        return `
          <tr>
            <td><strong>#${ord.orderNumber}</strong></td>
            <td>
              <div class="table-product-cell">
                <img src="${item.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80'}" alt="${item.title || ''}" class="table-product-thumb" />
                <div>
                  <div style="font-weight: 700; color: #fff;">${item.title || 'Product'}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.quantity || 1}</div>
                </div>
              </div>
            </td>
            <td>${dateStr}</td>
            <td style="font-weight: 700; color: #fff;">${formatCurrency(ord.finalAmountPaid)}</td>
            <td>
              <span class="badge badge-active">${ord.orderStatus.toUpperCase()}</span>
              ${ord.isTryBeforeYouBuyConversion ? '<span class="badge badge-try" style="margin-left: 0.3rem;">TBYB CONVERTED</span>' : ''}
            </td>
            <td>
              <span style="font-size: 0.85rem; color: var(--accent-cyan);">${ord.trackingNumber || 'Track: Standard Express'}</span>
            </td>
          </tr>
        `;
      })
      .join('');
  } catch (err) {
    console.error('Failed to load orders:', err);
  }
}

// Load Wishlist
async function loadCustomerWishlist() {
  const wishlistGrid = document.getElementById('customer-wishlist-grid');
  if (!wishlistGrid) return;

  try {
    const data = await apiRequest('/auth/me');
    const user = data.user;
    const saved = user.savedProducts || [];

    if (saved.length === 0) {
      wishlistGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          Your wishlist is empty. Save products you love by clicking the heart icon in the marketplace!
        </div>
      `;
      return;
    }

    wishlistGrid.innerHTML = saved
      .map((p) => {
        if (!p || typeof p !== 'object') return '';
        const img = p.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80';
        return `
          <div class="glass-card" style="padding: 1rem; display: flex; gap: 1rem; align-items: center;">
            <img src="${img}" alt="${p.title}" style="width: 70px; height: 70px; border-radius: var(--radius-sm); object-fit: cover;" />
            <div style="flex: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem;">${p.title}</h4>
              <div style="font-size: 0.85rem; color: #67E8F9; font-weight: 700;">Rent: ${formatCurrency(p.rentPricePerDay)}/day</div>
            </div>
            <a href="/product-details.html?id=${p._id}" class="btn btn-secondary btn-sm">View</a>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    console.error('Failed to load wishlist:', err);
  }
}
