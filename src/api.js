export const API_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:4000/api`)

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: isFormData ? { ...options.headers } : { 'Content-Type': 'application/json', ...options.headers },
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
  saveFavorite: (activityId) => request(`/favorites/${encodeURIComponent(activityId)}`, { method: 'POST' }),
  removeFavorite: (activityId) => request(`/favorites/${encodeURIComponent(activityId)}`, { method: 'DELETE' }),
  createGroupInquiry: (details) => request('/group-inquiries', { method: 'POST', body: JSON.stringify(details) }),
  createBooking: (details) => request('/bookings', { method: 'POST', body: JSON.stringify(details) }),
  myBookings: () => request('/bookings/mine'),
  cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  async downloadReceipt(id) {
    const response = await fetch(`${API_URL}/bookings/${id}/receipt`, { credentials: 'include', cache: 'no-store' })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'The receipt could not be downloaded.')
    }
    const url = URL.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = url
    link.download = `${id}-receipt.pdf`
    link.click()
    URL.revokeObjectURL(url)
  },
  createPaymentOrder: (bookingId, paymentKind = 'deposit') => request('/payments/create-order', { method: 'POST', body: JSON.stringify({ bookingId, paymentKind }) }),
  verifyPayment: (details) => request('/payments/verify', { method: 'POST', body: JSON.stringify(details) }),
  adminDashboard: () => request('/admin/dashboard'),
  adminBookings: (search = '') => request(`/admin/bookings?search=${encodeURIComponent(search)}`),
  adminGroupInquiries: (search = '') => request(`/admin/group-inquiries?search=${encodeURIComponent(search)}`),
  updateGroupInquiryStatus: (id, status) => request(`/admin/group-inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminActivities: () => request('/admin/activities'),
  createActivity: (details) => request('/admin/activities', { method: 'POST', body: JSON.stringify(details) }),
  updateActivity: (id, details) => request(`/admin/activities/${id}`, { method: 'PATCH', body: JSON.stringify(details) }),
  deleteActivity: (id) => request(`/admin/activities/${id}`, { method: 'DELETE' }),
  uploadActivityImage: (file) => {
    const body = new FormData()
    body.append('image', file)
    return request('/admin/uploads/activity-image', { method: 'POST', body })
  },
  updateBookingStatus: (id, status) => request(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateBookingAmount: (id, amount) => request(`/admin/bookings/${id}/amount`, { method: 'PATCH', body: JSON.stringify({ amount }) }),
  updateBookingGuests: (id, details) => request(`/admin/bookings/${id}/guests`, { method: 'PATCH', body: JSON.stringify(details) }),
  settleBookingBalance: (id) => request(`/admin/bookings/${id}/settle-balance`, { method: 'POST' }),
  completeRefund: (id) => request(`/admin/bookings/${id}/complete-refund`, { method: 'POST' }),
}
