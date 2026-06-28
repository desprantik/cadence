/** Marketplace catalog — all platforms discoverable in Connect platform. */

export const marketplaceCategories = [
  { id: 'all', label: 'All' },
  { id: 'courses', label: 'Courses' },
  { id: 'video', label: 'Video' },
  { id: 'creative', label: 'Creative' },
  { id: 'enterprise', label: 'Enterprise' },
];

export const marketplacePlatforms = [
  {
    id: 'udemy',
    name: 'Udemy',
    category: 'courses',
    popularity: 1,
    status: 'available',
    mcpSupported: true,
    manualSupported: true,
    badge: '#1 popular',
    summary: 'Sync courses, lecture progress, and certificates from Udemy Business.',
    description:
      'Connect via MCP OAuth to pull enrollments and build AI learning paths, or add courses manually.',
    searchTerms: ['udemy', 'business', 'courses', 'mcp'],
  },
  {
    id: 'coursera',
    name: 'Coursera',
    category: 'courses',
    popularity: 2,
    status: 'available',
    mcpSupported: true,
    manualSupported: true,
    badge: '#2 popular',
    summary: 'Import degrees, specializations, grades, and credentials.',
    description:
      'Enterprise partner MCP sync for programs and progress, with manual entry for personal accounts.',
    searchTerms: ['coursera', 'degree', 'certificate', 'university'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'video',
    popularity: 3,
    status: 'available',
    mcpSupported: true,
    manualSupported: true,
    badge: '#3 popular',
    summary: 'Turn learning playlists and education channels into courses.',
    description:
      'MCP adapter over YouTube Data API for playlists, or paste playlist URLs manually.',
    searchTerms: ['youtube', 'video', 'playlist', 'tutorials'],
  },
  {
    id: 'skillshare',
    name: 'Skillshare',
    category: 'creative',
    popularity: 4,
    status: 'available',
    mcpSupported: false,
    manualSupported: true,
    badge: 'Manual only',
    summary: 'Track creative classes and workshops without a public API.',
    description:
      'No MCP server available — add saved classes and mark progress yourself.',
    searchTerms: ['skillshare', 'creative', 'design', 'manual'],
  },
  {
    id: 'pluralsight',
    name: 'Pluralsight',
    category: 'enterprise',
    popularity: 5,
    status: 'available',
    mcpSupported: true,
    manualSupported: true,
    badge: 'Enterprise',
    summary: 'Sync skill paths, channels, and course completion for tech teams.',
    description:
      'MCP connector for Pluralsight Skills — requires business account.',
    searchTerms: ['pluralsight', 'tech', 'skills', 'paths'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Learning',
    category: 'enterprise',
    popularity: 6,
    status: 'available',
    mcpSupported: true,
    manualSupported: true,
    badge: 'Enterprise',
    summary: 'Import LinkedIn Learning paths and completed courses.',
    description:
      'OAuth MCP sync for organization libraries, or add completions manually.',
    searchTerms: ['linkedin', 'learning', 'professional'],
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    category: 'courses',
    popularity: 7,
    status: 'available',
    mcpSupported: false,
    manualSupported: true,
    badge: 'Free',
    summary: 'Track Khan Academy units and mastery progress manually.',
    description:
      'Free platform with no MCP yet — log courses and lesson completion yourself.',
    searchTerms: ['khan', 'academy', 'free', 'math'],
  },
  {
    id: 'codecademy',
    name: 'Codecademy',
    category: 'courses',
    popularity: 8,
    status: 'available',
    mcpSupported: true,
    manualSupported: true,
    badge: 'Interactive',
    summary: 'Sync coding paths, exercises, and project submissions.',
    description:
      'MCP tools for paths and progress, with manual fallback for Pro users.',
    searchTerms: ['codecademy', 'coding', 'python', 'javascript'],
  },
  {
    id: 'masterclass',
    name: 'MasterClass',
    category: 'video',
    popularity: 9,
    status: 'available',
    mcpSupported: false,
    manualSupported: true,
    badge: 'Video',
    summary: 'Log MasterClass sessions and notes manually.',
    description:
      'No official API — track watched classes and takeaways in Cadence.',
    searchTerms: ['masterclass', 'video', 'experts'],
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    category: 'courses',
    popularity: 10,
    status: 'coming_soon',
    mcpSupported: true,
    manualSupported: true,
    badge: 'Soon',
    summary: 'Language learning streaks and lesson progress.',
    description: 'MCP connector in development for Duolingo Super learners.',
    searchTerms: ['duolingo', 'language', 'streak'],
  },
  {
    id: 'brilliant',
    name: 'Brilliant',
    category: 'courses',
    popularity: 11,
    status: 'coming_soon',
    mcpSupported: true,
    manualSupported: false,
    badge: 'Soon',
    summary: 'Interactive STEM courses and problem sets.',
    description: 'Coming soon — MCP sync for Brilliant premium accounts.',
    searchTerms: ['brilliant', 'math', 'science'],
  },
  {
    id: 'edx',
    name: 'edX',
    category: 'courses',
    popularity: 12,
    status: 'coming_soon',
    mcpSupported: true,
    manualSupported: true,
    badge: 'Soon',
    summary: 'University courses and MicroMasters programs.',
    description: 'edX MCP connector planned for institutional partnerships.',
    searchTerms: ['edx', 'university', 'micromasters'],
  },
];

export function getMarketplacePlatform(id) {
  return marketplacePlatforms.find((p) => p.id === id) ?? null;
}

export function filterMarketplacePlatforms({
  query = '',
  category = 'all',
  method = 'all',
  sort = 'popular',
  installedIds = [],
  connectedIds = [],
}) {
  const q = query.trim().toLowerCase();

  let list = marketplacePlatforms.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (method === 'mcp' && !p.mcpSupported) return false;
    if (method === 'manual' && !p.manualSupported) return false;
    if (method === 'connected' && !connectedIds.includes(p.id)) return false;
    if (method === 'installed' && !installedIds.includes(p.id)) return false;
    if (!q) return true;
    const haystack = [p.name, p.summary, p.description, ...(p.searchTerms ?? [])]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  list = [...list].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'connected') {
      const aC = connectedIds.includes(a.id) ? 0 : 1;
      const bC = connectedIds.includes(b.id) ? 0 : 1;
      return aC - bC || a.popularity - b.popularity;
    }
    return a.popularity - b.popularity;
  });

  return list;
}
