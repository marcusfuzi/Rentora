/* ===================================================================
   RENTORA – MARKETPLACE CONTROLLER
   Supports Dedicated Rent Section, Separate Buy Section & Live Price Engine
=================================================================== */

let currentFilters = {
  search: '',
  category: 'All',
  listingType: 'all', // 'all' | 'rent' | 'buy'
  condition: 'All',
  maxPrice: 500000,
  sort: 'featured',
  page: 1,
};

let activeMarketplaceMode = 'all'; // 'all' | 'rent' | 'buy' | 'compare'
let debounceTimer = null;

// Switch top-level marketplace mode (Prompt Requirements 4 & 5)
function switchMarketplaceMode(mode) {
  activeMarketplaceMode = mode;
  document.querySelectorAll('#marketplace-mode-buttons button').forEach(b => b.classList.remove('active', 'btn-primary'));
  document.querySelectorAll('#marketplace-mode-buttons button').forEach(b => b.classList.add('btn-secondary'));

  const activeBtn = document.getElementById(`tab-mode-${mode}`);
  if (activeBtn) {
    activeBtn.classList.remove('btn-secondary');
    activeBtn.classList.add('btn-primary', 'active');
  }

  const pill = document.getElementById('mode-status-pill');
  const comparePanel = document.getElementById('live-compare-search-panel');

  if (mode === 'rent') {
    currentFilters.listingType = 'rent';
    if (pill) pill.innerHTML = '<i class="fas fa-calendar-alt" style="color: var(--accent-cyan);"></i> Dedicated Rent Section Active';
    if (comparePanel) comparePanel.style.display = 'none';
  } else if (mode === 'buy') {
    currentFilters.listingType = 'buy';
    if (pill) pill.innerHTML = '<i class="fas fa-shopping-bag" style="color: var(--accent-emerald);"></i> Separate Buy Section Active (Comparing Seller vs E-Commerce)';
    if (comparePanel) comparePanel.style.display = 'none';
  } else if (mode === 'compare') {
    if (pill) pill.innerHTML = '<i class="fas fa-bolt" style="color: #FBBF24;"></i> Price Comparison Engine Active';
    if (comparePanel) {
      comparePanel.style.display = 'block';
      document.getElementById('compare-query-input')?.focus();
    }
  } else {
    currentFilters.listingType = 'all';
    if (pill) pill.innerHTML = '<i class="fas fa-cube"></i> Viewing All Marketplace Listings';
    if (comparePanel) comparePanel.style.display = 'none';
  }

  loadMarketplaceProducts();
}

function closeComparePanel() {
  document.getElementById('live-compare-search-panel').style.display = 'none';
  switchMarketplaceMode('all');
}

// Run Buyhatke-style multi-platform search
async function runPriceComparisonSearch() {
  const query = document.getElementById('compare-query-input')?.value.trim();
  const resultsBox = document.getElementById('compare-search-results-box');
  if (!query || !resultsBox) return;

  resultsBox.style.display = 'block';
  resultsBox.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
      <p style="margin-top: 0.8rem; color: var(--text-muted);">Comparing "${query}" across Amazon, Flipkart, Croma, Reliance Digital...</p>
    </div>
  `;

  try {
    const data = await apiRequest('/price-comparison/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    const isLowest = data.platforms.find(p => p.isBestPrice);

    resultsBox.innerHTML = `
      <div class="glass-card" style="padding: 1.5rem; border: 1.5px solid #10B981; margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.3rem;">
              <span class="best-price-badge"><i class="fas fa-bolt"></i> BEST PRICE DETECTED</span>
              <span style="font-size: 0.8rem; color: var(--text-dim);">Exact Spec Matched</span>
            </div>
            <h3 style="font-size: 1.3rem; color: #fff; font-weight: 800;">${data.productTitle}</h3>
            <div style="font-size: 0.85rem; color: #10B981; font-weight: 700; margin-top: 0.3rem;">
              ${data.bestPriceText}
            </div>
          </div>
          <a href="/product-details.html?id=${data.productId}" class="btn btn-primary btn-sm">
            View Full Product Page <i class="fas fa-arrow-right"></i>
          </a>
        </div>

        <table class="comparison-table" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 0.6rem 0.8rem;">Platform</th>
              <th style="padding: 0.6rem 0.8rem;">Matched Price</th>
              <th style="padding: 0.6rem 0.8rem;">Shipping</th>
              <th style="padding: 0.6rem 0.8rem;">Availability</th>
              <th style="padding: 0.6rem 0.8rem;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.platforms.map(p => `
              <tr style="${p.isBestPrice ? 'background: rgba(16, 185, 129, 0.08); font-weight: 700;' : ''}">
                <td style="padding: 0.75rem 0.8rem;">
                  <span style="color: #fff;">${p.platform}</span>
                  ${p.isBestPrice ? '<span class="best-price-badge" style="font-size: 0.6rem; padding: 0.1rem 0.4rem; margin-left: 0.4rem;">BEST</span>' : ''}
                </td>
                <td style="padding: 0.75rem 0.8rem; color: ${p.isBestPrice ? '#10B981' : '#fff'}; font-size: 1.05rem;">
                  ${formatCurrency(p.currentPrice)}
                </td>
                <td style="padding: 0.75rem 0.8rem; font-size: 0.8rem; color: var(--text-muted);">
                  ${p.shippingCharges > 0 ? formatCurrency(p.shippingCharges) : 'FREE'}
                </td>
                <td style="padding: 0.75rem 0.8rem; font-size: 0.8rem;">
                  <span class="badge ${p.availability.includes('In Stock') ? 'badge-active' : 'badge-both'}">
                    ${p.availability}
                  </span>
                </td>
                <td style="padding: 0.75rem 0.8rem;">
                  ${p.isInternal ? `
                    <a href="/product-details.html?id=${data.productId}&action=buy" class="btn btn-primary btn-sm" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">
                      Buy from Seller
                    </a>
                  ` : `
                    <a href="${p.productUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">
                      Buy on ${p.platform.split(' ')[0]} <i class="fas fa-external-link-alt" style="font-size: 0.65rem;"></i>
                    </a>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    resultsBox.innerHTML = `
      <div class="glass-card" style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
        <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: var(--accent-rose); margin-bottom: 0.5rem; display: block;"></i>
        ${err.message || 'No direct match found. Try searching for "Samsung Galaxy A36", "Sony Alpha A7", or "MacBook M3".'}
      </div>
    `;
  }
}

async function loadMarketplaceProducts() {
  const gridContainer = document.getElementById('marketplace-products-grid');
  const countDisplay = document.getElementById('products-count');
  if (!gridContainer) return;

  gridContainer.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
      <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary);"></i>
      <p style="margin-top: 1rem; color: var(--text-muted);">Finding premium equipment...</p>
    </div>
  `;

  try {
    const params = new URLSearchParams();
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.category && currentFilters.category !== 'All') params.append('category', currentFilters.category);
    if (currentFilters.listingType && currentFilters.listingType !== 'all') params.append('listingType', currentFilters.listingType);
    if (currentFilters.condition && currentFilters.condition !== 'All') params.append('condition', currentFilters.condition);
    if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);
    if (currentFilters.sort) params.append('sort', currentFilters.sort);

    const data = await apiRequest(`/products?${params.toString()}`);

    if (countDisplay) {
      countDisplay.textContent = `Showing ${data.products.length} of ${data.total} listings`;
    }

    if (data.products.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <i class="fas fa-box-open" style="font-size: 3.5rem; color: var(--text-dim); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No products match your filters</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your search criteria, price range, or category filter.</p>
          <button class="btn btn-secondary btn-sm" id="clear-all-filters-btn">Reset All Filters</button>
        </div>
      `;
      document.getElementById('clear-all-filters-btn')?.addEventListener('click', resetFilters);
      return;
    }

    const user = getAuthUser();
    const savedIds = user?.savedProducts?.map(p => typeof p === 'string' ? p : p._id) || [];

    gridContainer.innerHTML = data.products
      .map((product) => {
        const isSaved = savedIds.includes(product._id);
        const image = product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';

        let badgeType = '';
        if (product.listingType === 'rent_only') {
          badgeType = '<span class="badge badge-rent"><i class="fas fa-history"></i> Rent Only</span>';
        } else if (product.listingType === 'sell_only') {
          badgeType = '<span class="badge badge-sell"><i class="fas fa-tag"></i> Buy Only</span>';
        } else {
          badgeType = '<span class="badge badge-both"><i class="fas fa-bolt"></i> Rent & Buy</span>';
        }

        const tbybBadge = product.tryBeforeYouBuyEnabled 
          ? '<span class="badge badge-try"><i class="fas fa-vial"></i> Try Before Buy</span>' 
          : '';

        return `
          <div class="glass-card product-card" data-id="${product._id}">
            <div class="product-card-badges">
              ${badgeType}
              ${tbybBadge}
            </div>
            
            <button class="product-wishlist-btn ${isSaved ? 'active' : ''}" onclick="toggleWishlist('${product._id}', this)" title="Add to Wishlist">
              <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i>
            </button>

            <a href="/product-details.html?id=${product._id}" class="product-img-wrap">
              <img src="${image}" alt="${product.title}" class="product-img" loading="lazy" />
            </a>

            <div class="product-info">
              <div class="product-category-row">
                <span>${product.category}</span>
                <div class="product-rating">
                  <i class="fas fa-star"></i>
                  <span>${product.rating ? product.rating.toFixed(1) : '4.8'} (${product.totalReviews || 0})</span>
                </div>
              </div>

              <a href="/product-details.html?id=${product._id}">
                <h3 class="product-title">${product.title}</h3>
              </a>

              <div class="product-pricing-box">
                ${product.rentPricePerDay > 0 ? `
                  <div class="price-item">
                    <span class="price-label">Rent from</span>
                    <span class="price-val-rent">${formatCurrency(product.rentPricePerDay)}<span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">/day</span></span>
                  </div>
                ` : '<div></div>'}

                ${product.buyPrice > 0 ? `
                  <div class="price-item" style="text-align: right;">
                    <span class="price-label">Buy for</span>
                    <span class="price-val-buy">${formatCurrency(product.buyPrice)}</span>
                  </div>
                ` : ''}
              </div>

              <div class="product-action-bar">
                ${product.rentPricePerDay > 0 ? `
                  <button class="btn btn-secondary btn-sm" onclick="openRentalBookingModal('${product._id}')">
                    <i class="fas fa-calendar-alt"></i> Rent
                  </button>
                ` : ''}
                ${product.buyPrice > 0 ? `
                  <button class="btn btn-primary btn-sm" onclick="openDirectBuyModal('${product._id}')">
                    <i class="fas fa-shopping-bag"></i> Buy
                  </button>
                ` : `
                  <a href="/product-details.html?id=${product._id}" class="btn btn-primary btn-sm" style="grid-column: 1 / -1;">
                    View Details
                  </a>
                `}
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--accent-rose);">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
        <p style="margin-top: 1rem;">Failed to load listings: ${err.message}</p>
      </div>
    `;
  }
}

function resetFilters() {
  currentFilters = {
    search: '',
    category: 'All',
    listingType: 'all',
    condition: 'All',
    maxPrice: 500000,
    sort: 'featured',
    page: 1,
  };

  const searchInput = document.getElementById('marketplace-search');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('price-filter-slider');
  const priceDisplay = document.getElementById('price-filter-display');
  if (priceSlider) priceSlider.value = 500000;
  if (priceDisplay) priceDisplay.textContent = '₹5,00,000+';

  document.querySelectorAll('.category-filter-item').forEach(el => {
    el.classList.toggle('active', el.dataset.category === 'All');
  });

  const sortSelect = document.getElementById('sort-products-select');
  if (sortSelect) sortSelect.value = 'featured';

  const radioAll = document.querySelector('input[name="listingTypeFilter"][value="all"]');
  if (radioAll) radioAll.checked = true;

  loadMarketplaceProducts();
}

// --- RENTAL BOOKING MODAL ---
let activeBookingProduct = null;

async function openRentalBookingModal(productId) {
  const user = getAuthUser();
  if (!user) {
    showToast('Please log in to book a rental', 'info');
    setTimeout(() => {
      window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
    }, 800);
    return;
  }

  try {
    const data = await apiRequest(`/products/${productId}`);
    activeBookingProduct = data.product;

    const modal = document.getElementById('rental-booking-modal');
    if (!modal) return;

    document.getElementById('modal-rental-prod-title').textContent = activeBookingProduct.title;
    document.getElementById('modal-rental-prod-img').src = activeBookingProduct.images[0] || '';
    document.getElementById('modal-rental-daily-rate').textContent = formatCurrency(activeBookingProduct.rentPricePerDay) + '/day';
    document.getElementById('modal-rental-deposit').textContent = formatCurrency(activeBookingProduct.securityDeposit);

    // Default start date = tomorrow, end date = 5 days from tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 6);

    const startInput = document.getElementById('modal-rental-start');
    const endInput = document.getElementById('modal-rental-end');

    startInput.value = tomorrow.toISOString().split('T')[0];
    startInput.min = tomorrow.toISOString().split('T')[0];
    endInput.value = futureDate.toISOString().split('T')[0];
    endInput.min = tomorrow.toISOString().split('T')[0];

    recalcModalRentalCost();

    modal.classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function recalcModalRentalCost() {
  if (!activeBookingProduct) return;

  const startVal = document.getElementById('modal-rental-start').value;
  const endVal = document.getElementById('modal-rental-end').value;

  if (!startVal || !endVal) return;

  const start = new Date(startVal);
  const end = new Date(endVal);

  if (end <= start) {
    document.getElementById('modal-rental-duration').textContent = 'Invalid Dates';
    document.getElementById('modal-rental-total').textContent = '—';
    return;
  }

  const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  document.getElementById('modal-rental-duration').textContent = `${durationDays} Days`;

  const dailyRate = activeBookingProduct.rentPricePerDay || 0;
  let rentalCost = dailyRate * durationDays;

  if (durationDays >= 30 && activeBookingProduct.rentPricePerMonth) {
    const months = Math.floor(durationDays / 30);
    const rem = durationDays % 30;
    rentalCost = months * activeBookingProduct.rentPricePerMonth + rem * dailyRate;
  } else if (durationDays >= 7 && activeBookingProduct.rentPricePerWeek) {
    const weeks = Math.floor(durationDays / 7);
    const rem = durationDays % 7;
    rentalCost = weeks * activeBookingProduct.rentPricePerWeek + rem * dailyRate;
  }

  const deposit = activeBookingProduct.securityDeposit || 0;
  const totalPayable = rentalCost + deposit;

  document.getElementById('modal-rental-cost-calc').textContent = formatCurrency(rentalCost);
  document.getElementById('modal-rental-total').textContent = formatCurrency(totalPayable);
}

// --- DIRECT BUY MODAL ---
let activeBuyProduct = null;

async function openDirectBuyModal(productId) {
  const user = getAuthUser();
  if (!user) {
    showToast('Please log in to purchase products', 'info');
    setTimeout(() => {
      window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
    }, 800);
    return;
  }

  try {
    const data = await apiRequest(`/products/${productId}`);
    activeBuyProduct = data.product;

    const modal = document.getElementById('direct-buy-modal');
    if (!modal) return;

    document.getElementById('modal-buy-prod-title').textContent = activeBuyProduct.title;
    document.getElementById('modal-buy-prod-img').src = activeBuyProduct.images[0] || '';
    document.getElementById('modal-buy-price').textContent = formatCurrency(activeBuyProduct.buyPrice);
    document.getElementById('modal-buy-total').textContent = formatCurrency(activeBuyProduct.buyPrice);

    modal.classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Initialize Marketplace Events
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('marketplace-products-grid');
  if (!gridContainer) return;

  // Search input with debounce
  const searchInput = document.getElementById('marketplace-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentFilters.search = e.target.value.trim();
        loadMarketplaceProducts();
      }, 350);
    });
  }

  // Category filter items
  const categoryItems = document.querySelectorAll('.category-filter-item');
  categoryItems.forEach((item) => {
    item.addEventListener('click', () => {
      categoryItems.forEach((c) => c.classList.remove('active'));
      item.classList.add('active');
      currentFilters.category = item.dataset.category;
      loadMarketplaceProducts();
    });
  });

  // Listing Type radios
  const listingRadios = document.querySelectorAll('input[name="listingTypeFilter"]');
  listingRadios.forEach((r) => {
    r.addEventListener('change', (e) => {
      currentFilters.listingType = e.target.value;
      loadMarketplaceProducts();
    });
  });

  // Price range slider
  const priceSlider = document.getElementById('price-filter-slider');
  const priceDisplay = document.getElementById('price-filter-display');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      priceDisplay.textContent = formatCurrency(val);
      currentFilters.maxPrice = val;
    });
    priceSlider.addEventListener('change', () => {
      loadMarketplaceProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sort-products-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      loadMarketplaceProducts();
    });
  }

  // Reset filter button
  document.getElementById('reset-filters-btn')?.addEventListener('click', resetFilters);

  // Modal Date Inputs Recalculation
  document.getElementById('modal-rental-start')?.addEventListener('change', recalcModalRentalCost);
  document.getElementById('modal-rental-end')?.addEventListener('change', recalcModalRentalCost);

  // Submit Rental Booking Form
  const rentalForm = document.getElementById('rental-booking-form');
  if (rentalForm) {
    rentalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!activeBookingProduct) return;

      const startDate = document.getElementById('modal-rental-start').value;
      const endDate = document.getElementById('modal-rental-end').value;
      const tryBeforeBuy = document.getElementById('modal-rental-tbyb-check')?.checked;
      const street = document.getElementById('modal-rental-street')?.value.trim();
      const city = document.getElementById('modal-rental-city')?.value.trim();
      const phone = document.getElementById('modal-rental-phone')?.value.trim();

      const submitBtn = rentalForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reserving Gear...';

      try {
        const payload = {
          productId: activeBookingProduct._id,
          startDate,
          endDate,
          tryBeforeYouBuy: tryBeforeBuy,
          deliveryAddress: {
            street: street || '14 Skyline Towers',
            city: city || 'Mumbai',
            phone: phone || '+91 99200 44556',
          },
        };

        const res = await apiRequest('/rentals', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        showToast(res.message, 'success');
        document.getElementById('rental-booking-modal')?.classList.remove('active');

        setTimeout(() => {
          window.location.href = '/my-rentals.html';
        }, 1000);
      } catch (err) {
        showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Confirm Rental Reservation';
      }
    });
  }

  // Submit Direct Buy Form
  const buyForm = document.getElementById('direct-buy-form');
  if (buyForm) {
    buyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!activeBuyProduct) return;

      const street = document.getElementById('modal-buy-street')?.value.trim();
      const city = document.getElementById('modal-buy-city')?.value.trim();
      const phone = document.getElementById('modal-buy-phone')?.value.trim();
      const paymentMethod = document.getElementById('modal-buy-payment')?.value || 'upi';

      const submitBtn = buyForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';

      try {
        const payload = {
          productId: activeBuyProduct._id,
          quantity: 1,
          paymentMethod,
          shippingAddress: {
            street: street || '14 Skyline Towers',
            city: city || 'Mumbai',
            phone: phone || '+91 99200 44556',
          },
        };

        const res = await apiRequest('/orders', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        showToast(res.message, 'success');
        document.getElementById('direct-buy-modal')?.classList.remove('active');

        setTimeout(() => {
          window.location.href = '/customer-dashboard.html';
        }, 1000);
      } catch (err) {
        showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Complete Purchase';
      }
    });
  }

  // Close modal buttons
  document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
    });
  });

  // Price comparison search button & enter key
  document.getElementById('run-compare-search-btn')?.addEventListener('click', runPriceComparisonSearch);
  document.getElementById('compare-query-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runPriceComparisonSearch();
  });

  // Parse URL search parameters for modes & filters
  const urlParams = new URLSearchParams(window.location.search);
  const modeParam = urlParams.get('listingType') || urlParams.get('mode');
  const searchParam = urlParams.get('search');
  const catParam = urlParams.get('category');

  if (searchParam) {
    currentFilters.search = searchParam;
    const sInput = document.getElementById('marketplace-search');
    if (sInput) sInput.value = searchParam;
  }

  if (catParam && catParam !== 'All') {
    currentFilters.category = catParam;
    document.querySelectorAll('.category-filter-item').forEach(el => {
      if (el.dataset.category.toLowerCase() === catParam.toLowerCase()) {
        document.querySelectorAll('.category-filter-item').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
      }
    });
  }

  if (modeParam === 'rent' || modeParam === 'buy' || modeParam === 'compare') {
    switchMarketplaceMode(modeParam);
  } else {
    // Load initial product listings
    loadMarketplaceProducts();
  }
});
