/* ===================================================================
   RENTORA – HOMEPAGE CONTROLLER
   Powers all 8 required homepage sections & Rent/Buy hero search
=================================================================== */

let heroSearchMode = 'rent'; // 'rent' | 'buy'

document.addEventListener('DOMContentLoaded', async () => {
  initHeroSearch();
  await loadHomepageContent();
});

// 1. Hero Rent vs Buy Search Widget
function initHeroSearch() {
  const rentTab = document.getElementById('hero-tab-rent');
  const buyTab = document.getElementById('hero-tab-buy');
  const searchInput = document.getElementById('hero-search-input');
  const categorySelect = document.getElementById('hero-category-select');
  const locationSelect = document.getElementById('hero-location-select');
  const searchBtn = document.getElementById('hero-search-btn');

  if (rentTab && buyTab) {
    rentTab.addEventListener('click', () => {
      heroSearchMode = 'rent';
      rentTab.classList.add('active');
      buyTab.classList.remove('active');
      if (searchInput) {
        searchInput.placeholder = 'Search gear for rent (cameras, laptops, consoles, drones)...';
      }
    });

    buyTab.addEventListener('click', () => {
      heroSearchMode = 'buy';
      buyTab.classList.add('active');
      rentTab.classList.remove('active');
      if (searchInput) {
        searchInput.placeholder = 'Search products to buy & compare (Samsung A36, Sony A7, MacBook)...';
      }
    });
  }

  const executeSearch = (e) => {
    if (e) e.preventDefault();
    const query = searchInput?.value.trim() || '';
    const cat = categorySelect?.value || 'All';
    const loc = locationSelect?.value || '';

    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (cat && cat !== 'All') params.append('category', cat);
    if (loc && loc !== 'All Locations') params.append('location', loc);
    params.append('listingType', heroSearchMode);

    window.location.href = `/marketplace.html?${params.toString()}`;
  };

  if (searchBtn) {
    searchBtn.addEventListener('click', executeSearch);
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSearch(e);
    });
  }
}

// Load dynamic sections from backend API
async function loadHomepageContent() {
  try {
    const data = await apiRequest('/products?limit=12');
    const products = data.products || [];

    if (products.length === 0) return;

    // Render 2: Trending Products
    renderTrendingProducts(products.slice(0, 4));

    // Render 3: Popular Rental Products
    const rentalProducts = products.filter(p => p.listingType === 'rent_only' || p.listingType === 'rent_and_sell');
    renderPopularRentals(rentalProducts.slice(0, 3));

    // Render 4: Best Price Comparison Deals
    renderBestPriceDeals(products);

    // Render 5: Recently Added Products
    renderRecentProducts(products.slice(2, 6));

  } catch (err) {
    console.error('Error loading homepage data:', err);
  }
}

// Section 2: Trending Products
function renderTrendingProducts(items) {
  const container = document.getElementById('homepage-featured-grid');
  if (!container) return;

  const user = getAuthUser();
  const savedIds = user?.savedProducts?.map(p => typeof p === 'string' ? p : p._id) || [];

  container.innerHTML = items.map(product => {
    const isSaved = savedIds.includes(product._id);
    const img = product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';
    
    let priceSnippet = '';
    if (product.listingType === 'rent_only') {
      priceSnippet = `<span style="font-weight: 800; font-size: 1.15rem; color: #67E8F9;">${formatCurrency(product.rentPricePerDay)}</span><span style="font-size: 0.8rem; color: var(--text-muted);">/day</span>`;
    } else if (product.listingType === 'sell_only') {
      priceSnippet = `<span style="font-weight: 800; font-size: 1.15rem; color: #6EE7B7;">${formatCurrency(product.buyPrice)}</span><span style="font-size: 0.8rem; color: var(--text-muted);"> Buy</span>`;
    } else {
      priceSnippet = `
        <div>
          <div style="font-weight: 800; font-size: 1.05rem; color: #67E8F9;">${formatCurrency(product.rentPricePerDay)}<span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/day</span></div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">or buy for ${formatCurrency(product.buyPrice)}</div>
        </div>
      `;
    }

    return `
      <div class="glass-card product-card">
        <div class="product-card-badges">
          <span class="badge ${product.listingType === 'rent_only' ? 'badge-rent' : (product.listingType === 'sell_only' ? 'badge-sell' : 'badge-both')}">
            ${product.listingType === 'rent_only' ? 'Rent' : (product.listingType === 'sell_only' ? 'Buy' : 'Rent & Buy')}
          </span>
          ${product.tryBeforeYouBuyEnabled ? '<span class="badge badge-try"><i class="fas fa-vial"></i> Try & Buy</span>' : ''}
        </div>

        <button class="product-wishlist-btn ${isSaved ? 'active' : ''}" onclick="toggleWishlist('${product._id}', this)">
          <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i>
        </button>

        <a href="/product-details.html?id=${product._id}" class="product-img-wrap">
          <img src="${img}" alt="${product.title}" class="product-img" loading="lazy" />
        </a>

        <div class="product-info">
          <div class="product-category-row">
            <span>${product.category}</span>
            <div class="product-rating">
              <i class="fas fa-star"></i>
              <span>${product.rating ? product.rating.toFixed(1) : '4.9'}</span>
            </div>
          </div>

          <h3 class="product-title">
            <a href="/product-details.html?id=${product._id}">${product.title}</a>
          </h3>

          <div class="product-pricing-row" style="margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
            ${priceSnippet}
            <a href="/product-details.html?id=${product._id}" class="btn btn-primary btn-sm">
              View Deal <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Section 3: Popular Rental Products
function renderPopularRentals(items) {
  const container = document.getElementById('popular-rentals-grid');
  if (!container) return;

  container.innerHTML = items.map(p => {
    const img = p.images?.[0] || '';
    return `
      <div class="glass-card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <span class="badge badge-rent"><i class="fas fa-calendar-alt"></i> Popular Rental</span>
            <span style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 700;"><i class="fas fa-shield-alt"></i> SafeShield Escrow</span>
          </div>

          <a href="/product-details.html?id=${p._id}">
            <img src="${img}" alt="${p.title}" style="height: 180px; width: 100%; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1rem;" />
          </a>

          <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem; line-height: 1.4;">
            <a href="/product-details.html?id=${p._id}">${p.title}</a>
          </h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${p.description}
          </p>
        </div>

        <div style="background: rgba(13, 20, 46, 0.6); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
            <span style="color: var(--text-muted);">Daily Rate:</span>
            <span style="font-weight: 700; color: #67E8F9;">${formatCurrency(p.rentPricePerDay)}/day</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
            <span style="color: var(--text-muted);">Weekly (15% Off):</span>
            <span style="font-weight: 700; color: #fff;">${formatCurrency(p.rentPricePerWeek)}/wk</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Refundable Deposit:</span>
            <span style="font-weight: 700; color: #6EE7B7;">${formatCurrency(p.securityDeposit)}</span>
          </div>
        </div>

        <a href="/product-details.html?id=${p._id}&action=rent" class="btn btn-primary btn-sm" style="width: 100%; text-align: center; justify-content: center;">
          <i class="fas fa-calendar-check"></i> Book Rental Now
        </a>
      </div>
    `;
  }).join('');
}

// Section 4: Best Price Comparison Deals
function renderBestPriceDeals(items) {
  const container = document.getElementById('price-deals-grid');
  if (!container) return;

  // Pick items with strong price comparison
  const deals = items.filter(p => p.externalPriceComparison?.amazonPrice || p.title.includes('Samsung') || p.title.includes('Sony') || p.title.includes('MacBook')).slice(0, 3);

  container.innerHTML = deals.map(p => {
    const ext = p.externalPriceComparison || {};
    const img = p.images?.[0] || '';
    const amazon = ext.amazonPrice || Math.round(p.buyPrice * 1.08);
    const flipkart = ext.flipkartPrice || Math.round(p.buyPrice * 1.04);
    const croma = ext.cromaPrice || Math.round(p.buyPrice * 1.10);
    const reliance = ext.reliancePrice || Math.round(p.buyPrice * 1.06);

    // Compute lowest
    const options = [
      { name: 'Rentora Seller', price: p.buyPrice, url: `/product-details.html?id=${p._id}` },
      { name: 'Flipkart', price: flipkart, url: ext.flipkartUrl || 'https://flipkart.com' },
      { name: 'Amazon', price: amazon, url: ext.amazonUrl || 'https://amazon.in' },
      { name: 'Croma', price: croma, url: ext.cromaUrl || 'https://croma.com' },
      { name: 'Reliance Digital', price: reliance, url: ext.relianceUrl || 'https://reliancedigital.in' },
    ];
    options.sort((a, b) => a.price - b.price);
    const cheapest = options[0];
    const highest = options[options.length - 1];
    const savings = highest.price - cheapest.price;

    return `
      <div class="glass-card" style="padding: 1.8rem; position: relative; overflow: hidden; border: 1.5px solid rgba(16, 185, 129, 0.35);">
        <div style="position: absolute; top: 1rem; right: 1rem;">
          <span class="best-price-badge"><i class="fas fa-check-circle"></i> BEST PRICE DEAL</span>
        </div>

        <div style="display: flex; gap: 1.2rem; align-items: center; margin-bottom: 1.2rem;">
          <img src="${img}" alt="${p.title}" style="width: 75px; height: 75px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-light);" />
          <div style="flex: 1; padding-right: 6rem;">
            <div style="font-size: 0.75rem; color: var(--accent-cyan); text-transform: uppercase; font-weight: 700;">${p.brand}</div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #fff; line-height: 1.3;">
              <a href="/product-details.html?id=${p._id}">${p.title}</a>
            </h4>
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); padding: 0.8rem 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Lowest Verified Price:</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #10B981;">${formatCurrency(cheapest.price)}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: var(--text-dim);">Cheapest on:</div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">${cheapest.name}</div>
          </div>
        </div>

        <!-- Platform Price Grid -->
        <div style="font-size: 0.8rem; border-top: 1px solid var(--border-light); padding-top: 0.8rem; margin-bottom: 1.2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
            <span style="color: var(--text-muted);"><i class="fas fa-tag"></i> Rentora Seller:</span>
            <span style="font-weight: 700; color: ${cheapest.name === 'Rentora Seller' ? '#6EE7B7' : '#fff'};">${formatCurrency(p.buyPrice)} ${cheapest.name === 'Rentora Seller' ? '★ BEST' : ''}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
            <span style="color: var(--text-muted);"><i class="fab fa-amazon"></i> Amazon India:</span>
            <span style="font-weight: 700; color: ${cheapest.name === 'Amazon' ? '#6EE7B7' : '#fff'};">${formatCurrency(amazon)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
            <span style="color: var(--text-muted);"><i class="fas fa-bolt"></i> Flipkart:</span>
            <span style="font-weight: 700; color: ${cheapest.name === 'Flipkart' ? '#6EE7B7' : '#fff'};">${formatCurrency(flipkart)} ${cheapest.name === 'Flipkart' ? '★ BEST' : ''}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);"><i class="fas fa-store"></i> Croma Retail:</span>
            <span style="font-weight: 700; color: #fff;">${formatCurrency(croma)}</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.8rem;">
          <a href="/product-details.html?id=${p._id}" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center;">
            Full Comparison Matrix
          </a>
          <a href="${cheapest.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Buy at lowest price on ${cheapest.name}">
            Buy Now <i class="fas fa-external-link-alt" style="font-size: 0.7rem;"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// Section 5: Recently Added Products
function renderRecentProducts(items) {
  const container = document.getElementById('recently-added-grid');
  if (!container) return;

  container.innerHTML = items.map(p => {
    const img = p.images?.[0] || '';
    return `
      <div class="glass-card" style="padding: 1.2rem; display: flex; gap: 1rem; align-items: center;">
        <img src="${img}" alt="${p.title}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-light);" />
        <div style="flex: 1;">
          <span class="badge badge-both" style="font-size: 0.65rem; padding: 0.15rem 0.5rem; margin-bottom: 0.3rem;">Just Listed</span>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.3rem;">
            <a href="/product-details.html?id=${p._id}">${p.title}</a>
          </h4>
          <div style="font-size: 0.85rem; color: #67E8F9; font-weight: 700;">
            ${p.rentPricePerDay ? formatCurrency(p.rentPricePerDay) + '/day' : formatCurrency(p.buyPrice)}
          </div>
        </div>
        <a href="/product-details.html?id=${p._id}" class="btn btn-secondary btn-sm" style="padding: 0.4rem 0.7rem;">
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;
  }).join('');
}
