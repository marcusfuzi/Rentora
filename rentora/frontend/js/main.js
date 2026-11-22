/* ===================================================================
   RENTORA – GLOBAL JAVASCRIPT & API CLIENT
=================================================================== */

// Determine API Base URL dynamically
const API_BASE = window.location.origin.includes('5000') || window.location.protocol === 'file:' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Format Indian Currency (INR)
function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Authentication Helpers
function getToken() {
  return localStorage.getItem('rentora_token');
}

function getAuthUser() {
  const userStr = localStorage.getItem('rentora_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

function setAuth(token, user) {
  localStorage.setItem('rentora_token', token);
  localStorage.setItem('rentora_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('rentora_token');
  localStorage.removeItem('rentora_user');
}

function logout() {
  clearAuth();
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 600);
}

// Universal API Request Wrapper
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/register')) {
        // Expired session
        clearAuth();
      }
      throw new Error(data.message || 'An error occurred with your request');
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// Toast Notifications
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';

  toast.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Toggle Wishlist / Save Product
async function toggleWishlist(productId, btnElement) {
  const user = getAuthUser();
  if (!user) {
    showToast('Please log in to save items to your wishlist', 'error');
    setTimeout(() => { window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`; }, 800);
    return;
  }

  try {
    const res = await apiRequest(`/auth/wishlist/${productId}`, {
      method: 'POST',
    });

    if (btnElement) {
      btnElement.classList.toggle('active', res.isSaved);
      btnElement.innerHTML = res.isSaved ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    }

    showToast(res.message, res.isSaved ? 'success' : 'info');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Theme Switcher Engine (Light / Dark Mode)
function initTheme() {
  const savedTheme = localStorage.getItem('rentora_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('rentora_theme', newTheme);
  updateThemeIcon(newTheme);
  showToast(`Switched to ${newTheme === 'dark' ? 'Dark Neon' : 'Light Premium'} mode`, 'info');
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle-btn i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// Global Demo Switch Helper
async function switchDemoRole(role) {
  try {
    const creds = {
      customer: { email: 'customer@rentora.com', password: 'password123' },
      seller: { email: 'seller@rentora.com', password: 'password123' },
      admin: { email: 'admin@rentora.com', password: 'password123' },
    };
    const c = creds[role] || creds.customer;
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(c),
    });
    setAuth(res.token, res.user);
    showToast(`Switched session to ${res.user.role.toUpperCase()} (${res.user.name})`, 'success');
    setTimeout(() => {
      if (role === 'admin') window.location.href = '/admin-dashboard.html';
      else if (role === 'seller') window.location.href = '/seller-dashboard.html';
      else window.location.href = '/customer-dashboard.html';
    }, 600);
  } catch (err) {
    showToast('Failed to switch demo role: ' + err.message, 'error');
  }
}

// Global Navigation Render
function updateNavigation() {
  const user = getAuthUser();
  const navActions = document.getElementById('nav-actions');
  const navLinks = document.getElementById('nav-links');

  if (!navActions) return;

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const themeIconClass = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  const themeBtnHtml = `
    <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle Light / Dark Mode" onclick="toggleTheme()">
      <i class="${themeIconClass}"></i>
    </button>
  `;

  if (user) {
    let dashboardLink = '/customer-dashboard.html';
    let roleBadge = 'Customer';
    let extraNavs = `
      <li><a href="/my-rentals.html" class="nav-link">My Rentals</a></li>
    `;

    if (user.role === 'seller') {
      dashboardLink = '/seller-dashboard.html';
      roleBadge = 'Seller Studio';
      extraNavs = `
        <li><a href="/seller-dashboard.html" class="nav-link">Seller Hub</a></li>
        <li><a href="/add-product.html" class="nav-link">+ Add Listing</a></li>
      `;
    } else if (user.role === 'admin') {
      dashboardLink = '/admin-dashboard.html';
      roleBadge = 'Platform Admin';
      extraNavs = `
        <li><a href="/admin-dashboard.html" class="nav-link">Admin Console</a></li>
      `;
    }

    if (navLinks && !navLinks.dataset.renderedRole) {
      navLinks.innerHTML = `
        <li><a href="/index.html" class="nav-link">Home</a></li>
        <li><a href="/marketplace.html" class="nav-link">Marketplace</a></li>
        <li><a href="/calculator.html" class="nav-link">Rent vs Buy</a></li>
        ${extraNavs}
      `;
      navLinks.dataset.renderedRole = user.role;
    }

    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        ${themeBtnHtml}
        <div class="user-menu-wrap">
          <button class="user-avatar-btn" id="user-menu-toggle">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="${user.name}" class="user-avatar-img" />
            <span style="font-weight: 600; font-size: 0.9rem;">${user.name.split(' ')[0]}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.75rem; margin-left: 0.2rem;"></i>
          </button>
          <div class="user-dropdown" id="user-dropdown-menu">
            <div class="user-dropdown-header">
              <div class="dropdown-user-name">${user.name}</div>
              <div class="dropdown-user-role">${roleBadge}</div>
            </div>
            <a href="${dashboardLink}"><i class="fas fa-chart-pie"></i> Dashboard</a>
            <a href="/profile.html"><i class="fas fa-user-circle"></i> Profile & Settings</a>
            ${user.role === 'customer' ? '<a href="/my-rentals.html"><i class="fas fa-clock"></i> Active Rentals</a>' : ''}
            ${user.role === 'seller' ? '<a href="/add-product.html"><i class="fas fa-plus-circle"></i> Add New Product</a>' : ''}
            <div style="border-top: 1px solid var(--border-light); margin: 0.4rem 0;"></div>
            <div style="padding: 0.3rem 1rem; font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Switch Role Demo</div>
            <div style="display: flex; gap: 0.4rem; padding: 0.2rem 1rem 0.6rem;">
              <button onclick="switchDemoRole('customer')" class="btn btn-secondary btn-sm" style="font-size: 0.65rem; padding: 0.2rem 0.5rem;">Customer</button>
              <button onclick="switchDemoRole('seller')" class="btn btn-secondary btn-sm" style="font-size: 0.65rem; padding: 0.2rem 0.5rem;">Seller</button>
              <button onclick="switchDemoRole('admin')" class="btn btn-secondary btn-sm" style="font-size: 0.65rem; padding: 0.2rem 0.5rem;">Admin</button>
            </div>
            <button id="logout-btn"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
          </div>
        </div>
      </div>
    `;

    const toggleBtn = document.getElementById('user-menu-toggle');
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    if (toggleBtn && dropdownMenu) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
      });
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
      });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        ${themeBtnHtml}
        <a href="/login.html" class="btn btn-secondary btn-sm">Sign In</a>
        <a href="/register.html" class="btn btn-primary btn-sm">Get Started</a>
      </div>
    `;
  }
}

// Auto highlight active nav link
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href === '/index.html' && (currentPath === '/' || currentPath === '')))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateNavigation();
  highlightActiveNav();

  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
});
