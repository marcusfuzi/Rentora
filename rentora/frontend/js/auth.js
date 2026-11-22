/* ===================================================================
   RENTORA – AUTHENTICATION (Login & Registration)
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect unless logging out
  const user = getAuthUser();
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get('redirect');

  // --- LOGIN FORM HANDLING ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    let selectedRole = 'customer';
    const roleTabs = document.querySelectorAll('.auth-role-tab');
    
    roleTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        roleTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        selectedRole = tab.dataset.role;
      });
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

      try {
        const res = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password, role: selectedRole }),
        });

        setAuth(res.token, res.user);
        showToast(`Welcome back, ${res.user.name}!`, 'success');

        setTimeout(() => {
          if (redirectTarget) {
            window.location.href = redirectTarget;
          } else if (res.user.role === 'admin') {
            window.location.href = '/admin-dashboard.html';
          } else if (res.user.role === 'seller') {
            window.location.href = '/seller-dashboard.html';
          } else {
            window.location.href = '/customer-dashboard.html';
          }
        }, 800);
      } catch (err) {
        showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In';
      }
    });

    // 1-Click Quick Demo Login Shortcuts
    const quickCustomer = document.getElementById('quick-login-customer');
    if (quickCustomer) {
      quickCustomer.addEventListener('click', () => {
        document.getElementById('login-email').value = 'customer@rentora.com';
        document.getElementById('login-password').value = 'password123';
        document.querySelector('[data-role="customer"]')?.click();
        loginForm.dispatchEvent(new Event('submit'));
      });
    }

    const quickSeller = document.getElementById('quick-login-seller');
    if (quickSeller) {
      quickSeller.addEventListener('click', () => {
        document.getElementById('login-email').value = 'seller@rentora.com';
        document.getElementById('login-password').value = 'password123';
        document.querySelector('[data-role="seller"]')?.click();
        loginForm.dispatchEvent(new Event('submit'));
      });
    }

    const quickAdmin = document.getElementById('quick-login-admin');
    if (quickAdmin) {
      quickAdmin.addEventListener('click', () => {
        document.getElementById('login-email').value = 'admin@rentora.com';
        document.getElementById('login-password').value = 'password123';
        document.querySelector('[data-role="admin"]')?.click();
        loginForm.dispatchEvent(new Event('submit'));
      });
    }
  }

  // --- REGISTRATION FORM HANDLING ---
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    let selectedRegRole = 'customer';
    const regRoleTabs = document.querySelectorAll('.reg-role-tab');
    const sellerFieldsWrap = document.getElementById('seller-specific-fields');

    regRoleTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        regRoleTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        selectedRegRole = tab.dataset.role;

        if (sellerFieldsWrap) {
          sellerFieldsWrap.style.display = selectedRegRole === 'seller' ? 'block' : 'none';
        }
      });
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const phone = document.getElementById('reg-phone')?.value.trim();
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      if (!name || !email || !password) {
        showToast('Please fill out all required fields', 'error');
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }

      const payload = {
        name,
        email,
        password,
        phone,
        role: selectedRegRole,
      };

      if (selectedRegRole === 'seller') {
        payload.storeName = document.getElementById('reg-store-name')?.value.trim() || `${name}'s Store`;
        payload.storeDescription = document.getElementById('reg-store-desc')?.value.trim() || 'Verified Seller on Rentora';
        payload.gstNumber = document.getElementById('reg-gst')?.value.trim() || '';
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

      try {
        const res = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        setAuth(res.token, res.user);
        showToast(`Account created successfully! Welcome to Rentora, ${res.user.name}.`, 'success');

        setTimeout(() => {
          if (res.user.role === 'seller') {
            window.location.href = '/seller-dashboard.html';
          } else {
            window.location.href = '/customer-dashboard.html';
          }
        }, 900);
      } catch (err) {
        showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Account';
      }
    });
  }
});
