import {
  completedCourses,
  inProgressCourses,
  recommendations,
} from './learner';

const discoverExtras = [
  {
    id: 'disc-1',
    title: 'Accessibility for Designers',
    platform: 'Coursera',
    topics: ['UX', 'Accessibility'],
    image:
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=480&h=280&fit=crop&q=80',
    instructor: 'University of Michigan',
    duration: '4 weeks',
    validated: true,
    price: { type: 'paid', subscriptionIncluded: true, label: 'Included in Coursera+' },
  },
  {
    id: 'disc-2',
    title: 'Framer for Interactive Prototypes',
    platform: 'Udemy',
    topics: ['Prototyping', 'UI'],
    image:
      'https://images.unsplash.com/photo-1558655146-d264dcf98377?w=480&h=280&fit=crop&q=80',
    instructor: 'Design+Code',
    duration: '8 hours',
    validated: true,
    price: { type: 'paid', amount: 49, currency: 'USD' },
  },
  {
    id: 'disc-3',
    title: 'Design Tokens Masterclass',
    platform: 'Skillshare',
    topics: ['Design Systems', 'UI'],
    image:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=480&h=280&fit=crop&q=80',
    instructor: 'Brad Frost',
    duration: '3h 10m',
    validated: true,
    price: { type: 'paid', amount: 15, currency: 'USD', label: 'Skillshare Premium' },
  },
  {
    id: 'disc-4',
    title: 'Figma Auto Layout Deep Dive',
    platform: 'YouTube',
    topics: ['Figma', 'UI'],
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&h=280&fit=crop&q=80',
    instructor: 'Mizko',
    duration: '1h 45m',
    validated: false,
    price: { type: 'free' },
  },
];

function toCatalogItem(course, overrides) {
  return { subscribed: false, saved: false, validated: true, ...course, ...overrides };
}

export const catalog = [
  ...inProgressCourses.map((c) =>
    toCatalogItem(c, {
      subscribed: true,
      status: 'in-progress',
      topics: inferTopics(c.title),
      price: { type: 'paid', label: 'Purchased' },
    })
  ),
  ...completedCourses.map((c) =>
    toCatalogItem(c, {
      subscribed: true,
      status: 'completed',
      topics: inferTopics(c.title),
      price: { type: 'paid', label: 'Purchased' },
    })
  ),
  ...recommendations.map((c) =>
    toCatalogItem(c, {
      subscribed: false,
      status: 'saved',
      topics: inferTopics(c.title),
      price: priceForPlatform(c.platform),
      timeToComplete: c.duration,
    })
  ),
  ...discoverExtras.map((c) =>
    toCatalogItem(c, {
      subscribed: false,
      status: 'discover',
      timeToComplete: c.duration,
    })
  ),
];

function inferTopics(title) {
  const t = title.toLowerCase();
  const topics = [];
  if (t.includes('figma') || t.includes('ui') || t.includes('design system')) topics.push('UI');
  if (t.includes('ux') || t.includes('research')) topics.push('UX');
  if (t.includes('brand') || t.includes('logo')) topics.push('Brand');
  if (t.includes('motion') || t.includes('animation')) topics.push('Motion');
  if (t.includes('typography')) topics.push('Typography');
  if (t.includes('illustration')) topics.push('Illustration');
  if (t.includes('3d') || t.includes('blender')) topics.push('3D');
  if (t.includes('color')) topics.push('Color');
  if (t.includes('accessibility')) topics.push('Accessibility');
  if (topics.length === 0) topics.push('Design');
  return topics;
}

function priceForPlatform(platform) {
  if (platform === 'YouTube') return { type: 'free' };
  if (platform === 'Coursera') {
    return { type: 'paid', subscriptionIncluded: true, label: 'Included in Coursera+' };
  }
  if (platform === 'Skillshare') {
    return { type: 'paid', amount: 15, currency: 'USD', label: 'Skillshare Premium' };
  }
  return { type: 'paid', amount: 39, currency: 'USD' };
}

export function formatPrice(price) {
  if (!price) return '';
  if (price.type === 'free') return 'Free';
  if (price.label) return price.label;
  if (price.amount) return `$${price.amount}`;
  return 'Paid';
}

export function getCatalogItem(id) {
  return catalog.find((item) => item.id === id);
}
