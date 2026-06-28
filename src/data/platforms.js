import { platformSlugs } from '../utils/routes';
import { getMarketplacePlatform } from './platformMarketplace';

const slugMap = {
  udemy: platformSlugs.Udemy,
  coursera: platformSlugs.Coursera,
  skillshare: platformSlugs.Skillshare,
  youtube: platformSlugs.YouTube,
};

export const STORAGE_KEY = 'cadence.platforms';

export const defaultPlatforms = [
  {
    id: 'udemy',
    name: 'Udemy',
    slug: platformSlugs.Udemy,
    mcpServerId: 'mcp-udemy',
    connected: false,
    lastSynced: null,
    pricingModel: 'pay-per-course',
    connectedAccount: null,
    authMethod: null,
    authLabel: null,
    mcpTools: null,
    syncedCourses: null,
    connectionMode: null,
    isCore: true,
  },
  {
    id: 'coursera',
    name: 'Coursera',
    slug: platformSlugs.Coursera,
    mcpServerId: 'mcp-coursera',
    connected: true,
    lastSynced: '2026-06-27T09:15:00Z',
    pricingModel: 'subscription',
    connectedAccount: 'learner@example.com',
    authMethod: 'oauth',
    authLabel: 'OAuth 2.0',
    mcpTools: ['list_enrollments', 'get_progress', 'search_catalog'],
    syncedCourses: 5,
    connectionMode: 'mcp',
    isCore: true,
  },
  {
    id: 'skillshare',
    name: 'Skillshare',
    slug: platformSlugs.Skillshare,
    mcpServerId: 'mcp-skillshare',
    connected: false,
    lastSynced: null,
    pricingModel: 'monthly',
    connectedAccount: null,
    authMethod: null,
    authLabel: null,
    mcpTools: null,
    syncedCourses: null,
    connectionMode: null,
    isCore: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    slug: platformSlugs.YouTube,
    mcpServerId: 'mcp-youtube',
    connected: true,
    lastSynced: '2026-06-26T18:45:00Z',
    pricingModel: 'free',
    connectedAccount: 'learner@gmail.com',
    authMethod: 'google_oauth',
    authLabel: 'Google OAuth 2.0',
    mcpTools: ['list_playlists', 'list_playlist_items'],
    syncedCourses: 12,
    connectionMode: 'mcp',
    isCore: true,
  },
];

const PERSISTED_KEYS = [
  'connected',
  'lastSynced',
  'connectedAccount',
  'authMethod',
  'authLabel',
  'mcpTools',
  'syncedCourses',
  'coursesInProgress',
  'coursesCompleted',
  'connectionMode',
  'isCore',
  'name',
  'slug',
  'mcpServerId',
  'pricingModel',
];

export function createPlatformFromCatalog(catalogEntry) {
  return {
    id: catalogEntry.id,
    name: catalogEntry.name,
    slug: slugMap[catalogEntry.id] ?? catalogEntry.id,
    mcpServerId: `mcp-${catalogEntry.id}`,
    connected: false,
    lastSynced: null,
    pricingModel: catalogEntry.category === 'enterprise' ? 'subscription' : 'free',
    connectedAccount: null,
    authMethod: null,
    authLabel: null,
    mcpTools: null,
    syncedCourses: null,
    connectionMode: null,
    isCore: defaultPlatforms.some((p) => p.id === catalogEntry.id),
  };
}

export function loadPlatforms() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultPlatforms;
    const parsed = JSON.parse(stored);
    const storedIds = Object.keys(parsed);

    const fromDefaults = defaultPlatforms
      .filter((p) => storedIds.includes(p.id))
      .map((p) => ({
        ...p,
        ...(parsed[p.id] ?? {}),
      }));

    const extras = storedIds
      .filter((id) => !defaultPlatforms.some((p) => p.id === id))
      .map((id) => {
        const catalog = getMarketplacePlatform(id);
        const base = catalog
          ? createPlatformFromCatalog(catalog)
          : { id, name: id, slug: id, mcpServerId: `mcp-${id}`, isCore: false };
        return { ...base, ...(parsed[id] ?? {}) };
      });

    return [...fromDefaults, ...extras];
  } catch {
    return defaultPlatforms;
  }
}

export function savePlatforms(platforms) {
  const patch = Object.fromEntries(
    platforms.map((p) => [
      p.id,
      Object.fromEntries(
        PERSISTED_KEYS.filter((k) => p[k] != null).map((k) => [k, p[k]])
      ),
    ])
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patch));
}

export function formatLastSynced(iso) {
  if (!iso) return 'Never synced';
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getPlatformBadgeType(platform) {
  if (platform.connectionMode === 'manual') return 'manual';
  if (platform.connectionMode === 'mcp') return 'mcp';
  return null;
}
