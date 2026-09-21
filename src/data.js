export const serviceCities = ['Delhi', 'Kota', 'Bombay', 'Pune', 'Jaipur', 'Gujarat']

export const categoryMeta = {
  birthday: {
    label: 'Birthday',
    eyebrow: 'Big smiles, beautifully planned',
    description: 'Hosts, performers and hands-on activities that keep every child engaged.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1400&q=85',
  },
  wedding: {
    label: 'Wedding',
    eyebrow: 'Details guests remember',
    description: 'Live art, entertainment and thoughtful experiences for your celebration.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
  },
  workshop: {
    label: 'Workshop',
    eyebrow: 'Make something together',
    description: 'Relaxed, beginner-friendly creative sessions for friends, families and teams.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1400&q=85',
  },
}

export const formatPrice = (price) => {
  if (price == null) return 'Request quote'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}
