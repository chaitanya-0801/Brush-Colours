export const categoryMeta = {
  birthday: {
    label: 'Birthday',
    eyebrow: 'Big smiles, beautifully planned',
    description: 'Hosts, performers and hands-on activities that keep every child engaged.',
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1400&q=85',
  },
  wedding: {
    label: 'Wedding',
    eyebrow: 'Details guests remember',
    description: 'Live art, entertainment and thoughtful experiences for your celebration.',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
  },
  workshop: {
    label: 'Workshop',
    eyebrow: 'Make something together',
    description: 'Relaxed, beginner-friendly creative sessions for friends, families and teams.',
    image:
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1400&q=85',
  },
}

export const activities = [
  {
    id: 'pottery-party',
    category: 'workshop',
    title: 'Pottery Party',
    short: 'Shape, spin and paint your own ceramic keepsake with a patient studio artist.',
    description:
      'A warm, hands-on pottery experience designed for complete beginners. Your facilitator brings clay, tools, aprons and plenty of encouragement while every guest creates something personal to take home.',
    price: 4699,
    priceUnit: 'per group',
    duration: '2 hrs',
    guests: '2–10 guests',
    location: 'Delhi NCR',
    rating: 4.9,
    reviews: 320,
    badge: 'Most loved',
    minLeadDays: 1,
    image:
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85',
    includes: ['Clay and pottery tools', 'Aprons and workspace setup', 'Guided 2-hour session', 'One creation per guest'],
  },
  {
    id: 'magic-and-games',
    category: 'birthday',
    title: 'Magic & Games',
    short: 'An interactive magic show and energetic games designed around the birthday child.',
    description:
      'A lively celebration package combining a professional magic show with age-appropriate group games. The host keeps the children involved from the first trick to the final applause.',
    price: 3999,
    priceUnit: 'per event',
    duration: '90 mins',
    guests: '15–30 guests',
    location: 'Delhi NCR',
    rating: 4.8,
    reviews: 210,
    badge: 'Popular',
    minLeadDays: 2,
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85',
    includes: ['Interactive magic show', 'Party games', 'Music and basic props', 'Bilingual host'],
  },
  {
    id: 'wedding-live-art',
    category: 'wedding',
    title: 'Wedding Live Art',
    short: 'A live artist captures your celebration and creates a one-of-a-kind heirloom.',
    description:
      'Watch an artist turn one meaningful moment into a finished artwork during your event. The composition and palette are discussed in advance so the final piece feels completely yours.',
    price: 7499,
    priceUnit: 'starting price',
    duration: '4 hrs',
    guests: 'Any event size',
    location: 'Delhi NCR',
    rating: 5.0,
    reviews: 118,
    badge: 'Signature',
    minLeadDays: 5,
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
    includes: ['Pre-event consultation', 'Live event painting', 'Professional art materials', 'Finished artwork'],
  },
  {
    id: 'little-makers-studio',
    category: 'birthday',
    title: 'Little Makers Studio',
    short: 'A colourful guided craft station where every child makes a party keepsake.',
    description:
      'A beautifully styled craft table with a friendly facilitator and age-appropriate materials. Children can explore freely while still completing a polished take-home project.',
    price: 5499,
    priceUnit: 'per event',
    duration: '2 hrs',
    guests: '10–25 guests',
    location: 'Delhi NCR',
    rating: 4.9,
    reviews: 144,
    badge: 'New',
    minLeadDays: 2,
    image:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=85',
    includes: ['Craft supplies', 'Styled activity table', 'Facilitator', 'Take-home creations'],
  },
  {
    id: 'wedding-couple-quiz',
    category: 'wedding',
    title: 'The Couple Quiz',
    short: 'A polished emcee-led game that gets both families laughing and talking.',
    description:
      'A personalised, warm and never-awkward game experience built around the couple. We prepare the prompts with you and handle the complete on-stage flow.',
    price: 8999,
    priceUnit: 'per event',
    duration: '60 mins',
    guests: '50–250 guests',
    location: 'Delhi NCR',
    rating: 4.8,
    reviews: 89,
    badge: 'Crowd favourite',
    minLeadDays: 5,
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    includes: ['Professional emcee', 'Personalised game plan', 'Props', 'Event coordination'],
  },
  {
    id: 'resin-keepsake-workshop',
    category: 'workshop',
    title: 'Resin Keepsake Workshop',
    short: 'Create luminous coasters or trays using colour, texture and pressed botanicals.',
    description:
      'A calm, guided resin session with pre-measured materials and a choice of palettes. Perfect for friends, date nights and small team experiences.',
    price: 3499,
    priceUnit: 'per group',
    duration: '2 hrs',
    guests: '2–8 guests',
    location: 'Delhi NCR',
    rating: 4.8,
    reviews: 172,
    badge: 'Trending',
    minLeadDays: 1,
    image:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85',
    includes: ['Resin and pigments', 'Moulds and tools', 'Safety equipment', 'Two finished pieces per guest'],
  },
  {
    id: 'carnival-games',
    category: 'birthday',
    title: 'Mini Carnival Games',
    short: 'A cheerful set of skill games with a coordinator, prizes and colourful counters.',
    description:
      'Turn your venue into a compact carnival with games that work for mixed age groups. Our coordinator sets up, runs each round and keeps the pace moving.',
    price: 6499,
    priceUnit: 'per event',
    duration: '2 hrs',
    guests: '20–50 guests',
    location: 'Delhi NCR',
    rating: 4.7,
    reviews: 98,
    badge: 'High energy',
    minLeadDays: 3,
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85',
    includes: ['Four game counters', 'Game coordinator', 'Setup and pack-down', 'Basic prizes'],
  },
  {
    id: 'guest-portrait-bar',
    category: 'wedding',
    title: 'Guest Portrait Bar',
    short: 'Quick, elegant illustrated portraits that double as unforgettable wedding favours.',
    description:
      'Guests sit for a few minutes while our illustrator creates a charming personalised portrait. Every piece is presented in a protective sleeve to take home.',
    price: 12999,
    priceUnit: 'starting price',
    duration: '4 hrs',
    guests: 'Up to 80 portraits',
    location: 'Delhi NCR',
    rating: 4.9,
    reviews: 76,
    badge: 'Premium',
    minLeadDays: 7,
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85',
    includes: ['Live illustrator', 'Premium paper', 'Personalised name cards', 'Portrait sleeves'],
  },
  {
    id: 'texture-art-lab',
    category: 'workshop',
    title: 'Texture Art Lab',
    short: 'Build a tactile modern canvas with palette knives, sculpting paste and colour.',
    description:
      'Learn the satisfying process of layering texture and shaping a contemporary artwork. Choose from several beginner-friendly compositions and take home a display-ready canvas.',
    price: 2999,
    priceUnit: 'per group',
    duration: '2 hrs',
    guests: '2–10 guests',
    location: 'Delhi NCR',
    rating: 4.8,
    reviews: 132,
    badge: 'Beginner friendly',
    minLeadDays: 1,
    image:
      'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85',
    includes: ['Canvas and art materials', 'Palette knives', 'Instructor', 'Protective apron'],
  },
]

export const bookings = [
  { id: 'MM-1048', day: 14, month: 'JUN', activity: 'Pottery Party', time: '10:00 AM – 12:00 PM', guests: 6, status: 'Confirmed' },
  { id: 'MM-1049', day: 14, month: 'JUN', activity: 'Resin Keepsake Workshop', time: '2:00 PM – 4:00 PM', guests: 4, status: 'Payment pending' },
  { id: 'MM-1051', day: 15, month: 'JUN', activity: 'Magic & Games', time: '11:00 AM – 12:30 PM', guests: 28, status: 'Confirmed' },
  { id: 'MM-1054', day: 16, month: 'JUN', activity: 'Wedding Live Art', time: '4:00 PM – 8:00 PM', guests: 180, status: 'Blocked' },
]

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
