import { getCachedData, setCachedData } from './cache';

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('bushra_token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`Erreur serveur (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  return data;
}

/**
 * Cache-first request that loads instantaneously from memory/IndexedDB
 * and refreshes in the background (SWR pattern)
 */
async function cachedRequest(endpoint, cacheKey) {
  const key = cacheKey || endpoint;
  
  // Try fetching fresh data in background
  const fetchPromise = request(endpoint).then((fresh) => {
    setCachedData(key, fresh);
    return fresh;
  });

  // Check fast local cache
  const cached = await getCachedData(key);
  if (cached !== null) {
    // Return cached immediately and refresh in background
    fetchPromise.catch(() => {});
    return cached;
  }

  // If no cache, await network
  return await fetchPromise;
}

export const api = {
  // Products
  getProducts: (params = {}, options = { useCache: true }) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/products${query ? `?${query}` : ''}`;
    if (options.useCache) {
      return cachedRequest(endpoint, `products_${query}`);
    }
    return request(endpoint);
  },
  getProduct: (id, options = { useCache: true }) => {
    const endpoint = `/products/${id}`;
    if (options.useCache) {
      return cachedRequest(endpoint, `product_${id}`);
    }
    return request(endpoint);
  },
  getSimilar: (id) => request(`/products/${id}/similar`),

  // Categories
  getCategories: (options = { useCache: true }) => {
    const endpoint = '/categories';
    if (options.useCache) {
      return cachedRequest(endpoint, 'categories_all');
    }
    return request(endpoint);
  },
  getCategory: (id) => request(`/categories/${id}`),

  // Orders
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  trackOrder: (orderNumber, phone) =>
    request(`/orders/track?orderNumber=${orderNumber}&phone=${encodeURIComponent(phone)}`),

  // Reviews
  createReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Shop info
  getShopInfo: () => cachedRequest('/shop-info', 'shop_info'),

  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // Admin
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    getChart: (period) => request(`/admin/dashboard/chart?period=${period}`),
    getProducts: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/products${query ? `?${query}` : ''}`);
    },
    createProduct: (data) => request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
    uploadImage: (id, formData) =>
      request(`/admin/products/${id}/images`, {
        method: 'POST',
        body: formData,
        headers: {},
      }),
    getOrders: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/orders${query ? `?${query}` : ''}`);
    },
    getOrder: (id) => request(`/admin/orders/${id}`),
    updateOrderStatus: (id, status, adminNote) =>
      request(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNote }),
      }),
    createOrder: (data) => request('/admin/orders', { method: 'POST', body: JSON.stringify(data) }),
    getReviews: () => request('/admin/reviews'),
    approveReview: (id) => request(`/admin/reviews/${id}/approve`, { method: 'PATCH' }),
    deleteReview: (id) => request(`/admin/reviews/${id}`, { method: 'DELETE' }),
    getCategories: () => request('/categories'),
    createCategory: (data) => request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    updateCategory: (id, data) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getNotifications: () => request('/admin/notifications'),
    markNotifRead: (id) => request(`/admin/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/admin/notifications/read-all', { method: 'PATCH' }),
    getLowStock: () => request('/admin/stock/low'),
    getCustomers: () => request('/admin/customers'),
  },
};

export function getImageUrl(path) {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) return path;
  return `/uploads/${path}`;
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}
