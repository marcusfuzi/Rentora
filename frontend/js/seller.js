/* ===================================================================
   RENTORA – SELLER DASHBOARD & INVENTORY CONTROLLER
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const user = getAuthUser();
  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    window.location.href = '/login.html?redirect=/seller-dashboard.html';
    return;
  }

  // Populate seller info
  const storeNameEl = document.getElementById('dash-seller-store-name');
  const sellerNameEl = document.getElementById('dash-seller-name');
  const sellerAvatarEl = document.getElementById('dash-seller-avatar');

  if (storeNameEl) storeNameEl.textContent = user.sellerDetails?.storeName || `${user.name}'s Gear Studio`;
  if (sellerNameEl) sellerNameEl.textContent = user.name;
  if (sellerAvatarEl && user.avatar) sellerAvatarEl.src = user.avatar;

  loadSellerDashboardData();
  setupAddProductForm();
});

let sellerRevenueChart = null;

async function loadSellerDashboardData() {
  try {
    // 1. Load Seller Inventory
    const inventoryData = await apiRequest('/products/seller/inventory');
    const products = inventoryData.products || [];

    const totalListingsEl = document.getElementById('seller-metric-listings');
    if (totalListingsEl) totalListingsEl.textContent = products.length;

    renderSellerInventoryTable(products);

    // 2. Load Seller Rentals
    const rentalsData = await apiRequest('/rentals/seller-rentals');
    const rentals = rentalsData.rentals || [];

    const pendingRequests = rentals.filter((r) => r.status === 'pending');
    const activeRentals = rentals.filter((r) => r.status === 'active');
    const returnRequested = rentals.filter((r) => r.status === 'return_requested');

    const pendingCountEl = document.getElementById('seller-metric-pending');
    const activeCountEl = document.getElementById('seller-metric-active');
    const totalRevEl = document.getElementById('seller-metric-revenue');

    if (pendingCountEl) pendingCountEl.textContent = pendingRequests.length;
    if (activeCountEl) activeCountEl.textContent = activeRentals.length;

    // Calculate revenue
    let totalRevenue = 0;
    rentals.forEach((r) => {
      if (['active', 'returned', 'return_requested', 'converted_to_purchase'].includes(r.status)) {
        totalRevenue += r.totalRentalCost;
      }
    });

    if (totalRevEl) totalRevEl.textContent = formatCurrency(totalRevenue);

    renderSellerRentalRequests(rentals);
    renderSellerRevenueChart(rentals);
  } catch (err) {
    showToast('Failed to load seller dashboard: ' + err.message, 'error');
  }
}

// Render Inventory Table
function renderSellerInventoryTable(products) {
  const tableBody = document.getElementById('seller-inventory-table-body');
  if (!tableBody) return;

  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
          You haven't added any products yet. Click "+ Add New Product" to list your gear!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = products
    .map((p) => {
      const img = p.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80';

      let typeBadge = '';
      if (p.listingType === 'rent_only') {
        typeBadge = '<span class="badge badge-rent">Rent Only</span>';
      } else if (p.listingType === 'sell_only') {
        typeBadge = '<span class="badge badge-sell">Sell Only</span>';
      } else {
        typeBadge = '<span class="badge badge-both">Rent & Sell</span>';
      }

      return `
        <tr>
          <td>
            <div class="table-product-cell">
              <img src="${img}" alt="${p.title}" class="table-product-thumb" />
              <div>
                <a href="/product-details.html?id=${p._id}" style="font-weight: 700; color: #fff;">${p.title}</a>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${p.category} | ${p.brand}</div>
              </div>
            </div>
          </td>
          <td>${typeBadge}</td>
          <td>
            ${p.rentPricePerDay > 0 ? `<div style="font-weight: 700; color: #67E8F9;">${formatCurrency(p.rentPricePerDay)}/day</div>` : ''}
            ${p.buyPrice > 0 ? `<div style="font-size: 0.85rem; color: #A5B4FC;">Buy: ${formatCurrency(p.buyPrice)}</div>` : ''}
          </td>
          <td>${p.stockQuantity} units</td>
          <td>
            <span class="badge ${p.isAvailable ? 'badge-active' : 'badge-overdue'}">${p.isAvailable ? 'Available' : 'Unlisted'}</span>
          </td>
          <td>
            <div class="table-action-btns">
              <a href="/add-product.html?edit=${p._id}" class="btn btn-secondary btn-sm" title="Edit Product">
                <i class="fas fa-edit"></i>
              </a>
              <button class="btn btn-secondary btn-sm" onclick="deleteSellerProduct('${p._id}', '${p.title}')" style="color: var(--accent-rose);" title="Delete Product">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

// Delete product
async function deleteSellerProduct(productId, title) {
  if (!confirm(`Are you sure you want to delete listing for "${title}"?`)) return;

  try {
    const res = await apiRequest(`/products/${productId}`, {
      method: 'DELETE',
    });
    showToast(res.message, 'success');
    loadSellerDashboardData();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Render Rental Requests & Returns
function renderSellerRentalRequests(rentals) {
  const tableBody = document.getElementById('seller-rentals-table-body');
  if (!tableBody) return;

  if (rentals.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          No rental orders or requests yet.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = rentals
    .map((r) => {
      const prod = r.product || {};
      const cust = r.customer || {};
      const startStr = new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const endStr = new Date(r.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

      let actions = '';
      if (r.status === 'pending') {
        actions = `
          <button class="btn btn-primary btn-sm" onclick="updateRentalRequestStatus('${r._id}', 'approved')" style="background: var(--accent-emerald);">
            <i class="fas fa-check"></i> Approve
          </button>
          <button class="btn btn-secondary btn-sm" onclick="updateRentalRequestStatus('${r._id}', 'rejected')" style="color: var(--accent-rose);">
            <i class="fas fa-times"></i> Reject
          </button>
        `;
      } else if (r.status === 'return_requested') {
        actions = `
          <button class="btn btn-primary btn-sm" onclick="openCompleteReturnModal('${r._id}')">
            <i class="fas fa-clipboard-check"></i> Inspect & Refund
          </button>
        `;
      } else if (r.status === 'active') {
        actions = `<span style="font-size: 0.85rem; color: #34D399;"><i class="fas fa-check-circle"></i> In Customer Care</span>`;
      } else {
        actions = `<span style="font-size: 0.85rem; color: var(--text-muted);">${r.status.toUpperCase()}</span>`;
      }

      return `
        <tr>
          <td><strong>#${r.rentalNumber}</strong></td>
          <td>
            <div style="font-weight: 700; color: #fff;">${prod.title || 'Product'}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Customer: ${cust.name || 'Anonymous'}</div>
          </td>
          <td>${r.durationDays} days (${startStr} - ${endStr})</td>
          <td>
            <div style="font-weight: 700; color: #fff;">${formatCurrency(r.totalRentalCost)}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Deposit: ${formatCurrency(r.securityDeposit)}</div>
          </td>
          <td>
            <span class="badge badge-${r.status}">${r.status.toUpperCase()}</span>
          </td>
          <td>
            <div class="table-action-btns">
              ${actions}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

// Approve / Reject rental
async function updateRentalRequestStatus(rentalId, status) {
  try {
    const res = await apiRequest(`/rentals/${rentalId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    showToast(res.message, 'success');
    loadSellerDashboardData();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Open Complete Return & Deposit Inspection Modal
let inspectionRentalId = null;

function openCompleteReturnModal(rentalId) {
  inspectionRentalId = rentalId;
  const modal = document.getElementById('complete-return-modal');
  if (modal) modal.classList.add('active');
}

async function submitReturnInspection() {
  if (!inspectionRentalId) return;

  const condition = document.getElementById('inspect-condition')?.value || 'Good';
  const notes = document.getElementById('inspect-notes')?.value.trim();
  const damageDeduction = Number(document.getElementById('inspect-damage-fee')?.value) || 0;

  try {
    const res = await apiRequest(`/rentals/${inspectionRentalId}/complete-return`, {
      method: 'POST',
      body: JSON.stringify({
        conditionOnReturn: condition,
        damageAssessmentNotes: notes,
        damageDeduction,
      }),
    });

    showToast(res.message, 'success');
    document.getElementById('complete-return-modal')?.classList.remove('active');
    loadSellerDashboardData();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Render Revenue Chart
function renderSellerRevenueChart(rentals) {
  const canvas = document.getElementById('seller-revenue-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyRevenue = [18000, 24000, 31000, 42000, 38000, 56000, 62000, 71000, 85000, 92000, 88000, 105000];

  if (sellerRevenueChart) {
    sellerRevenueChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  sellerRevenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Rental Revenue (₹)',
          data: monthlyRevenue,
          backgroundColor: 'rgba(99, 102, 241, 0.75)',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94A3B8' } },
        tooltip: {
          callbacks: {
            label: (ctx) => `Revenue: ₹${ctx.raw.toLocaleString('en-IN')}`,
          },
        },
      },
      scales: {
        x: { ticks: { color: '#64748B' }, grid: { display: false } },
        y: {
          ticks: {
            color: '#64748B',
            callback: (v) => '₹' + v.toLocaleString('en-IN'),
          },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
      },
    },
  });
}

// Setup Add / Edit Product Form
function setupAddProductForm() {
  const form = document.getElementById('add-product-form');
  if (!form) return;

  const listingTypeSelect = document.getElementById('prod-listing-type');
  const rentFields = document.getElementById('rent-pricing-fields');
  const buyFields = document.getElementById('buy-pricing-fields');

  if (listingTypeSelect) {
    listingTypeSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'rent_only') {
        if (rentFields) rentFields.style.display = 'block';
        if (buyFields) buyFields.style.display = 'none';
      } else if (val === 'sell_only') {
        if (rentFields) rentFields.style.display = 'none';
        if (buyFields) buyFields.style.display = 'block';
      } else {
        if (rentFields) rentFields.style.display = 'block';
        if (buyFields) buyFields.style.display = 'block';
      }
    });
  }

  // Pre-fill if editing
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');

  if (editId) {
    document.getElementById('add-prod-page-title').textContent = 'Edit Product Listing';
    apiRequest(`/products/${editId}`).then((data) => {
      const p = data.product;
      document.getElementById('prod-title').value = p.title;
      document.getElementById('prod-category').value = p.category;
      document.getElementById('prod-brand').value = p.brand;
      document.getElementById('prod-condition').value = p.condition;
      document.getElementById('prod-desc').value = p.description;
      document.getElementById('prod-listing-type').value = p.listingType;
      document.getElementById('prod-buy-price').value = p.buyPrice || 0;
      document.getElementById('prod-rent-day').value = p.rentPricePerDay || 0;
      document.getElementById('prod-deposit').value = p.securityDeposit || 0;
      document.getElementById('prod-stock').value = p.stockQuantity || 1;
      document.getElementById('prod-image-url').value = p.images?.join(', ') || '';
      document.getElementById('prod-tbyb').checked = p.tryBeforeYouBuyEnabled;

      listingTypeSelect.dispatchEvent(new Event('change'));
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('prod-title').value.trim();
    const category = document.getElementById('prod-category').value;
    const brand = document.getElementById('prod-brand').value.trim();
    const condition = document.getElementById('prod-condition').value;
    const ram = document.getElementById('prod-ram')?.value.trim() || '';
    const storage = document.getElementById('prod-storage')?.value.trim() || '';
    const color = document.getElementById('prod-color')?.value.trim() || '';
    const modelNumber = document.getElementById('prod-model')?.value.trim() || '';
    const description = document.getElementById('prod-desc').value.trim();
    const listingType = document.getElementById('prod-listing-type').value;
    const buyPrice = Number(document.getElementById('prod-buy-price')?.value) || 0;
    const rentPricePerDay = Number(document.getElementById('prod-rent-day')?.value) || 0;
    const securityDeposit = Number(document.getElementById('prod-deposit')?.value) || 0;
    const stockQuantity = Number(document.getElementById('prod-stock')?.value) || 1;
    const imageUrlRaw = document.getElementById('prod-image-url')?.value.trim();
    const tryBeforeYouBuyEnabled = document.getElementById('prod-tbyb')?.checked;

    const images = imageUrlRaw
      ? imageUrlRaw.split(',').map((u) => u.trim()).filter(Boolean)
      : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'];

    const payload = {
      title,
      category,
      brand,
      modelNumber,
      condition,
      description,
      variant: {
        ram,
        storage,
        color,
        condition,
      },
      listingType,
      buyPrice,
      rentPricePerDay,
      securityDeposit,
      stockQuantity,
      images,
      tryBeforeYouBuyEnabled,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Listing...';

    try {
      if (editId) {
        await apiRequest(`/products/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast('Product updated successfully!', 'success');
      } else {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast('Product listed on Rentora marketplace!', 'success');
      }

      setTimeout(() => {
        window.location.href = '/seller-dashboard.html';
      }, 900);
    } catch (err) {
      showToast(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = editId ? 'Update Listing' : 'Publish Listing';
    }
  });
}
