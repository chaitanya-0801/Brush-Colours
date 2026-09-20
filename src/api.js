const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:4000/api`

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

export const api = {
  getConfig: () => request('/config'),
  getActivities: () => request('/activities'),
  me: () => request('/auth/me'),
  login: (details) => request('/auth/login', { method: 'POST', body: JSON.stringify(details) }),
  register: (details) => request('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  changePassword: (details) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(details) }),
  createBooking: (details) => request('/bookings', { method: 'POST', body: JSON.stringify(details) }),
  myBookings: () => request('/bookings/mine'),
  createPaymentOrder: (bookingId) => request('/payments/create-order', { method: 'POST', body: JSON.stringify({ bookingId }) }),
  verifyPayment: (details) => request('/payments/verify', { method: 'POST', body: JSON.stringify(details) }),
  adminDashboard: () => request('/admin/dashboard'),
  adminBookings: (search = '') => request(`/admin/bookings?search=${encodeURIComponent(search)}`),
  updateActivity: (id, price) => request(`/admin/activities/${id}`, { method: 'PATCH', body: JSON.stringify({ price }) }),
  updateBookingStatus: (id, status) => request(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}
