export const platformSlugs = {
  Udemy: 'udemy',
  Coursera: 'coursera',
  Skillshare: 'skillshare',
  YouTube: 'youtube',
};

const slugToPlatform = Object.fromEntries(
  Object.entries(platformSlugs).map(([name, slug]) => [slug, name])
);

export function platformHref(platform, status) {
  const slug = platformSlugs[platform];
  if (!slug) return '#/';
  return `#/platform/${slug}/${status}`;
}

export function libraryHref(platform) {
  if (!platform) return '#/library';
  const slug = platformSlugs[platform];
  return slug ? `#/library/${slug}` : '#/library';
}

export function searchHref(query, filter = 'all') {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (filter && filter !== 'all') params.set('filter', filter);
  const qs = params.toString();
  return qs ? `#/search?${qs}` : '#/search';
}

export function sessionHref() {
  return '#/session';
}

export function parseRoute(hash) {
  const raw = hash.replace(/^#\/?/, '');
  const [path, queryString] = raw.split('?');
  const params = new URLSearchParams(queryString ?? '');

  const platformMatch = path.match(
    /^platform\/([a-z]+)\/(enrolled|in-progress|completed)$/
  );
  if (platformMatch) {
    const platform = slugToPlatform[platformMatch[1]];
    if (platform) {
      return { name: 'platform', platform, status: platformMatch[2] };
    }
  }

  const libraryMatch = path.match(/^library(?:\/([a-z]+))?$/);
  if (libraryMatch) {
    const platform = libraryMatch[1]
      ? slugToPlatform[libraryMatch[1]]
      : null;
    return {
      name: 'library',
      platform,
      status: params.get('status') ?? 'all',
    };
  }

  if (path === 'search') {
    return {
      name: 'search',
      query: params.get('q') ?? '',
      filter: params.get('filter') ?? 'all',
    };
  }

  if (path === 'settings') return { name: 'settings' };
  if (path === 'profile') return { name: 'profile' };
  if (path === 'session') return { name: 'session' };

  return {
    name: 'dashboard',
    celebrate: params.get('celebrate') === '1',
  };
}

export const statusLabels = {
  enrolled: 'Enrolled',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export function isNavActive(routeName, currentRoute) {
  if (routeName === 'dashboard') {
    return currentRoute.name === 'dashboard' || currentRoute.name === 'platform';
  }
  return currentRoute.name === routeName;
}
