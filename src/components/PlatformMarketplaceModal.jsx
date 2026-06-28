import { useEffect, useMemo, useState } from 'react';
import PlatformLogo from './PlatformLogo';
import {
  filterMarketplacePlatforms,
  marketplaceCategories,
  marketplacePlatforms,
} from '../data/platformMarketplace';

const METHOD_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'mcp', label: 'MCP' },
  { id: 'manual', label: 'Manual' },
  { id: 'connected', label: 'Connected' },
];

function MarketplaceIcon({ connected, installed }) {
  if (connected) {
    return (
      <span className="marketplace-card__action marketplace-card__action--connected" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (installed) {
    return (
      <span className="marketplace-card__action marketplace-card__action--installed" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="marketplace-card__action marketplace-card__action--add" aria-hidden="true">+</span>
  );
}

export default function PlatformMarketplaceModal({
  platforms,
  onClose,
  onConnectMcp,
  onConnectManual,
  onNotifyComingSoon,
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [method, setMethod] = useState('all');
  const [sort, setSort] = useState('popular');
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('connectors');

  const installedIds = platforms.map((p) => p.id);
  const connectedIds = platforms.filter((p) => p.connected).map((p) => p.id);

  const results = useMemo(
    () =>
      filterMarketplacePlatforms({
        query,
        category,
        method,
        sort,
        installedIds,
        connectedIds,
      }),
    [query, category, method, sort, installedIds, connectedIds]
  );

  const selected =
    marketplacePlatforms.find((p) => p.id === selectedId) ??
    results[0] ??
    null;

  const selectedInstalled = selected
    ? platforms.find((p) => p.id === selected.id)
    : null;
  const isSelectedConnected = !!selectedInstalled?.connected;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSelect = (entry) => {
    if (entry.status === 'coming_soon') {
      onNotifyComingSoon(entry.name);
      return;
    }
    setSelectedId(entry.id);
  };

  const handleMcp = () => {
    if (!selected || selected.status === 'coming_soon') return;
    if (!selected.mcpSupported) return;
    onConnectMcp(selected.id);
  };

  const handleManual = () => {
    if (!selected || selected.status === 'coming_soon') return;
    if (!selected.manualSupported) return;
    onConnectManual(selected.id);
  };

  return (
    <div className="platform-marketplace" role="presentation">
      <button
        type="button"
        className="platform-marketplace__backdrop"
        onClick={onClose}
        aria-label="Close marketplace"
      />
      <div
        className="platform-marketplace__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="marketplace-title"
      >
        <aside className="platform-marketplace__sidebar">
          <p className="platform-marketplace__sidebar-label">Directory</p>
          <nav className="platform-marketplace__nav">
            <button type="button" className="platform-marketplace__nav-item" disabled>
              Skills
              <span className="platform-marketplace__nav-soon">Soon</span>
            </button>
            <button
              type="button"
              className={`platform-marketplace__nav-item${activeTab === 'connectors' ? ' platform-marketplace__nav-item--active' : ''}`}
              onClick={() => setActiveTab('connectors')}
            >
              Connectors
            </button>
            <button type="button" className="platform-marketplace__nav-item" disabled>
              Plugins
              <span className="platform-marketplace__nav-soon">Soon</span>
            </button>
          </nav>
        </aside>

        <div className="platform-marketplace__main">
          <header className="platform-marketplace__header">
            <div>
              <h2 id="marketplace-title" className="platform-marketplace__title">
                Connectors
              </h2>
              <p className="platform-marketplace__subtitle">
                {marketplacePlatforms.length} learning platforms · MCP or manual
              </p>
            </div>
            <button
              type="button"
              className="platform-marketplace__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <div className="platform-marketplace__toolbar">
            <div className="platform-marketplace__search-wrap">
              <svg className="platform-marketplace__search-icon" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                className="platform-marketplace__search"
                placeholder="Search connectors…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="platform-marketplace__toolbar-filters">
              <select
                className="platform-marketplace__select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Category"
              >
                {marketplaceCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label === 'All' ? 'All categories' : c.label}
                  </option>
                ))}
              </select>
              <select
                className="platform-marketplace__select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                aria-label="Connection type"
              >
                {METHOD_FILTERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id === 'all' ? 'All types' : f.label}
                  </option>
                ))}
              </select>
              <select
                className="platform-marketplace__select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort by"
              >
                <option value="popular">Popular</option>
                <option value="name">A–Z</option>
                <option value="connected">Connected first</option>
              </select>
            </div>
          </div>

          <p className="platform-marketplace__result-count" aria-live="polite">
            {results.length} {results.length === 1 ? 'connector' : 'connectors'}
          </p>

          <div className="platform-marketplace__body">
            <div className="platform-marketplace__grid-wrap">
              {results.length === 0 ? (
                <p className="platform-marketplace__empty">No connectors match your search.</p>
              ) : (
                <ul className="platform-marketplace__grid">
                  {results.map((entry) => {
                    const installed = installedIds.includes(entry.id);
                    const connected = connectedIds.includes(entry.id);
                    const isSelected = selected?.id === entry.id;

                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          className={[
                            'marketplace-card',
                            isSelected && 'marketplace-card--selected',
                            entry.status === 'coming_soon' && 'marketplace-card--soon',
                            connected && 'marketplace-card--connected',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => handleSelect(entry)}
                        >
                          <div className="marketplace-card__top">
                            <PlatformLogo platform={entry.name} size={28} />
                            <MarketplaceIcon connected={connected} installed={installed} />
                          </div>
                          <p className="marketplace-card__name">{entry.name}</p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {selected && (
              <aside className="platform-marketplace__detail">
                <div className="platform-marketplace__detail-head">
                  <PlatformLogo platform={selected.name} size={36} />
                  <div>
                    <h3 className="platform-marketplace__detail-title">{selected.name}</h3>
                    <p className="platform-marketplace__detail-badge">{selected.badge}</p>
                  </div>
                </div>

                <p className="platform-marketplace__detail-desc">{selected.description}</p>

                <div className="platform-marketplace__detail-methods">
                  {selected.mcpSupported && (
                    <span className="platform-marketplace__method-tag platform-marketplace__method-tag--mcp">
                      MCP
                    </span>
                  )}
                  {selected.manualSupported && (
                    <span className="platform-marketplace__method-tag platform-marketplace__method-tag--manual">
                      Manual
                    </span>
                  )}
                  {selected.status === 'coming_soon' && (
                    <span className="platform-marketplace__method-tag">Coming soon</span>
                  )}
                </div>

                {isSelectedConnected ? (
                  <p className="platform-marketplace__detail-status">Already connected</p>
                ) : selected.status === 'coming_soon' ? (
                  <button
                    type="button"
                    className="btn btn--primary platform-marketplace__detail-btn"
                    onClick={() => onNotifyComingSoon(selected.name)}
                  >
                    Notify me
                  </button>
                ) : (
                  <div className="platform-marketplace__detail-actions">
                    {selected.mcpSupported && (
                      <button
                        type="button"
                        className="btn btn--primary platform-marketplace__detail-btn"
                        onClick={handleMcp}
                      >
                        Connect via MCP
                      </button>
                    )}
                    {selected.manualSupported && (
                      <button
                        type="button"
                        className="btn platform-marketplace__detail-btn"
                        onClick={handleManual}
                      >
                        Add manually
                      </button>
                    )}
                  </div>
                )}
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
