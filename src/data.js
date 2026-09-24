export const serviceCities = ['Delhi', 'Kota', 'Bombay', 'Pune', 'Jaipur', 'Gujarat']

export const categoryMeta = {
  birthday: {
    label: 'Birthday',
    eyebrow: 'Big smiles, beautifully planned',
    description: 'Hosts, performers and hands-on activities that keep every child engaged.',
    image: 'https://res.cloudinary.com/bwunptda/image/upload/v1790226818/1bandc.jpg',
  },
  wedding: {
    label: 'Wedding',
    eyebrow: 'Details guests remember',
    description: 'Live art, entertainment and thoughtful experiences for your celebration.',
    image:'https://res.cloudinary.com/bwunptda/image/upload/v1790226818/2bndc.jpg',
  },
  workshop: {
    label: 'Workshop',
    eyebrow: 'Make something together',
    description: 'Relaxed, beginner-friendly creative sessions for friends, families and teams.',
    image: 'https://res.cloudinary.com/bwunptda/image/upload/v1790226818/3bandc.jpg',
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

export const activityImageStyle = (activity = {}) => {
  const x = Number(activity.imagePositionX ?? 50)
  const y = Number(activity.imagePositionY ?? 50)
  const zoom = Number(activity.imageZoom ?? 1)
  return {
    objectPosition: `${x}% ${y}%`,
    transformOrigin: `${x}% ${y}%`,
    transform: `scale(${zoom})`,
  }
}
