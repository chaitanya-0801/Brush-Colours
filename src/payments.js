import { api } from './api'

let razorpayScript

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve()
  if (razorpayScript) return razorpayScript

  razorpayScript = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('The payment window could not be loaded. Please check your connection and try again.'))
    document.head.appendChild(script)
  })
  return razorpayScript
}

export async function completePayment(order, bookingId, user, contact = '') {
  if (order.provider === 'development') {
    return api.verifyPayment({ bookingId, orderId: order.orderId })
  }

  if (order.provider !== 'razorpay') throw new Error('This payment provider is not supported.')
  await loadRazorpay()

  return new Promise((resolve, reject) => {
    let completed = false
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'Brush&Colours',
      description: order.paymentKind === 'deposit' ? '₹299 event pre-booking' : 'Event balance payment',
      prefill: { name: user?.name || '', email: user?.email || '', contact },
      retry: { enabled: true, max_count: 3 },
      theme: { color: '#ec8768' },
      handler: async (response) => {
        try {
          const result = await api.verifyPayment({
            bookingId,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          })
          completed = true
          resolve(result)
        } catch (error) {
          reject(error)
        }
      },
      modal: {
        ondismiss: () => {
          if (!completed) reject(new Error('Payment was cancelled. Your booking details are saved, so you can try again.'))
        },
      },
    })
    checkout.on('payment.failed', (response) => reject(new Error(response.error?.description || 'Payment failed. Please try again.')))
    checkout.open()
  })
}
