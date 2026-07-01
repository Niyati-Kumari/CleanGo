const API_BASE = 'https://cleango-production.up.railway.app/api';

function getToken() {
  return localStorage.getItem('cleango_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  getCatalog: () => request('/cleaners/catalog'),
  getCleaners: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/cleaners?${qs}`);
  },
  getOrderStatuses: () => request('/orders/statuses'),
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  progressOrder: (id) => request(`/orders/${id}/progress`, { method: 'POST' }),

  partnerRegister: (body) =>
    request('/partner/register', { method: 'POST', body: JSON.stringify(body) }),
  partnerGetProfile: () => request('/partner/me'),
  partnerUpdateProfile: (body) =>
    request('/partner/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  partnerUpdatePrices: (body) =>
    request('/partner/prices', { method: 'PATCH', body: JSON.stringify(body) }),
  partnerDashboard: () => request('/partner/dashboard'),
  partnerEarnings: () => request('/partner/earnings'),
  partnerOrders: (filter = 'all') => request(`/partner/orders?filter=${filter}`),
  partnerOrder: (id) => request(`/partner/orders/${id}`),
  partnerAcceptOrder: (id) => request(`/partner/orders/${id}/accept`, { method: 'POST' }),
  partnerRejectOrder: (id, body) =>
    request(`/partner/orders/${id}/reject`, { method: 'POST', body: JSON.stringify(body || {}) }),
  partnerUpdateOrderStatus: (id, body) =>
    request(`/partner/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),

  registerDeliveryPartner: (body) =>
    request('/delivery/register', { method: 'POST', body: JSON.stringify(body) }),
  getDeliveryProfile: () => request('/delivery/me'),
  updateDeliveryProfile: (body) =>
    request('/delivery/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  toggleDeliveryOnline: () => request('/delivery/toggle-online', { method: 'POST' }),
  updateDeliveryLocation: (body) =>
    request('/delivery/location', { method: 'PATCH', body: JSON.stringify(body) }),
  getAvailableDeliveries: () => request('/delivery/deliveries'),
  acceptDelivery: (id) => request(`/delivery/deliveries/${id}/accept`, { method: 'POST' }),
  updateDeliveryStatus: (id, body) =>
    request(`/delivery/deliveries/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
  getDeliveryEarnings: () => request('/delivery/earnings'),

  adminDashboard: () => request('/admin/dashboard'),
  adminUsers: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users?${qs}`);
  },
  adminCleaners: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/cleaners?${qs}`);
  },
  adminApproveCleaner: (id) => request(`/admin/cleaners/${id}/approve`, { method: 'POST' }),
  adminRejectCleaner: (id) => request(`/admin/cleaners/${id}/reject`, { method: 'POST' }),
  adminDeliveryPartners: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/delivery-partners?${qs}`);
  },
  adminApproveDeliveryPartner: (id) => request(`/admin/delivery-partners/${id}/approve`, { method: 'POST' }),
  adminRejectDeliveryPartner: (id) => request(`/admin/delivery-partners/${id}/reject`, { method: 'POST' }),
  adminOrders: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/orders?${qs}`);
  },
  adminRevenue: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/revenue?${qs}`);
  },
};
