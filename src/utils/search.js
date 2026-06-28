import { catalog } from '../data/catalog';

export function searchCatalog(query, filter = 'all') {
  const q = query.trim().toLowerCase();

  let items = catalog;

  if (filter === 'library') {
    items = items.filter((item) => item.subscribed);
  } else if (filter === 'discover') {
    items = items.filter((item) => !item.subscribed);
  }

  if (!q) return items;

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.platform,
      item.instructor,
      ...(item.topics ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export const searchFilters = [
  { id: 'all', label: 'All' },
  { id: 'library', label: 'My library' },
  { id: 'discover', label: 'Discover' },
];

export const exampleQueries = [
  'Figma prototyping',
  'UX research',
  'Free YouTube courses',
  'Design systems',
];
