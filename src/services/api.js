const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('rentora_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Auth OTP with Password & Real Email
  async sendOtp(payload) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(typeof payload === 'string' ? { email: payload } : payload)
    });
    return handleResponse(res);
  },

  async verifyOtp(payload) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Forgot Password OTP & Reset
  async forgotPasswordOtp(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(res);
  },

  async resetPassword(payload) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Auth
  async login(email, password, role) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async demoSwitchRole(role) {
    const res = await fetch(`${API_BASE}/auth/demo-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    return handleResponse(res);
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Rentals & Orders
  async getRentals() {
    const res = await fetch(`${API_BASE}/rentals`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createRental(rentalData) {
    const res = await fetch(`${API_BASE}/rentals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(rentalData)
    });
    return handleResponse(res);
  },

  async updateRentalStatus(id, status) {
    const res = await fetch(`${API_BASE}/rentals/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async requestReturn(id) {
    const res = await fetch(`${API_BASE}/rentals/${id}/return`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async extendRental(id, extraDays) {
    const res = await fetch(`${API_BASE}/rentals/${id}/extend`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ extraDays })
    });
    return handleResponse(res);
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },

  // Disputes
  async getDisputes() {
    const res = await fetch(`${API_BASE}/disputes`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createDispute(disputeData) {
    const res = await fetch(`${API_BASE}/disputes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(disputeData)
    });
    return handleResponse(res);
  },

  async resolveDispute(id, resolutionData) {
    const res = await fetch(`${API_BASE}/disputes/${id}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(resolutionData)
    });
    return handleResponse(res);
  },

  // KYC
  async submitKyc(kycData) {
    const res = await fetch(`${API_BASE}/kyc/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(kycData)
    });
    return handleResponse(res);
  },

  // Analytics
  async getSellerAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/seller`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/admin`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
