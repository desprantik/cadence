import { useEffect, useState } from 'react';
import ConnectPlatformButton from '../components/ConnectPlatformMenu';
import ManualConnectModal from '../components/ManualConnectModal';
import McpAuthModal from '../components/McpAuthModal';
import PlatformConnectionToggle from '../components/PlatformConnectionToggle';
import PlatformLogo from '../components/PlatformLogo';
import PlatformMarketplaceModal from '../components/PlatformMarketplaceModal';
import PlatformToolTags from '../components/PlatformToolTags';
import RemovePlatformDialog from '../components/RemovePlatformDialog';
import { getMarketplacePlatform } from '../data/platformMarketplace';
import { getAuthConfig, getConnectionBadgeLabel } from '../data/platformAuth';
import { formatLastSynced } from '../data/platforms';
import { usePlatforms } from '../context/PlatformContext';

function RefreshIcon({ spinning }) {
  return (
    <svg
      className={`platform-settings-card__refresh-icon${spinning ? ' platform-settings-card__refresh-icon--spin' : ''}`}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 4v6h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getBadgeType(platform, config) {
  if (platform.connectionMode === 'manual') return 'manual';
  if (platform.connectionMode === 'mcp') return 'mcp';
  return config.connectionType;
}

export default function Settings() {
  const {
    platforms,
    authPlatform,
    manualPlatform,
    marketplaceOpen,
    syncingId,
    toast,
    openMarketplace,
    closeMarketplace,
    startConnect,
    startManualConnect,
    cancelConnect,
    cancelManualConnect,
    completeConnect,
    completeManualConnect,
    disconnect,
    syncNow,
    removePlatform,
  } = usePlatforms();

  const [localToast, setLocalToast] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const connectedCount = platforms.filter((p) => p.connected).length;
  const activeToast = toast ?? localToast;

  useEffect(() => {
    if (!localToast) return undefined;
    const t = setTimeout(() => setLocalToast(null), 2800);
    return () => clearTimeout(t);
  }, [localToast]);

  const handleToggle = (platform, nextOn) => {
    if (nextOn) {
      const catalog = getMarketplacePlatform(platform.id);
      if (catalog && !catalog.mcpSupported) {
        startManualConnect(platform.id);
      } else {
        startConnect(platform.id);
      }
    } else {
      disconnect(platform.id);
    }
  };

  return (
    <div className="page-content page-content--narrow">
      <header className="settings-page-header">
        <div className="settings-page-header__row">
          <div>
            <p className="eyebrow">Settings</p>
            <h1 className="page-header__title">Platform connections</h1>
            <p className="settings-page-header__stat">
              {connectedCount} of {platforms.length} connected
            </p>
          </div>
          <ConnectPlatformButton
            onClick={openMarketplace}
            disabled={!!authPlatform || !!manualPlatform}
          />
        </div>
      </header>

      <section className="settings-section" aria-label="Platforms">
        {platforms.length === 0 ? (
          <div className="platform-settings-empty">
            <p className="platform-settings-empty__title">No platforms connected</p>
            <p className="platform-settings-empty__sub">
              Add a learning platform via MCP or manual entry from the marketplace.
            </p>
            <button type="button" className="btn btn--primary" onClick={openMarketplace}>
              Connect platform
            </button>
          </div>
        ) : (
        <ul className="platform-settings-list">
          {platforms.map((platform) => {
            const config = getAuthConfig(platform.id);
            const isAuthOpen = authPlatform?.id === platform.id;
            const isSyncing = syncingId === platform.id;
            const isBusy = isAuthOpen || isSyncing;
            const isDisabled = !platform.connected;
            const badgeType = getBadgeType(platform, config);

            return (
              <li
                key={platform.id}
                className={[
                  'platform-settings-card',
                  isSyncing && 'platform-settings-card--shimmer',
                  isDisabled && 'platform-settings-card--disabled',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <PlatformLogo platform={platform.name} size={isDisabled ? 24 : 32} />
                <div className="platform-settings-card__info">
                  <div className="platform-settings-card__title-row">
                    <p className="platform-settings-card__name">{platform.name}</p>
                    {platform.connected && (
                      <span
                        className={`platform-connection-badge platform-connection-badge--${badgeType}`}
                      >
                        {getConnectionBadgeLabel(badgeType)}
                      </span>
                    )}
                  </div>
                  <div className="platform-settings-card__meta-row">
                    <p className="platform-settings-card__meta">
                      {isSyncing
                        ? 'Refreshing…'
                        : isAuthOpen
                          ? 'Connecting…'
                          : platform.connected
                            ? `Last synced ${formatLastSynced(platform.lastSynced)}`
                            : 'Not connected'}
                    </p>
                    {platform.connected && platform.connectionMode !== 'manual' && (
                      <button
                        type="button"
                        className="platform-settings-card__refresh"
                        onClick={() => syncNow(platform.id)}
                        disabled={isBusy}
                        aria-label={`Refresh ${platform.name} sync`}
                      >
                        <RefreshIcon spinning={isSyncing} />
                      </button>
                    )}
                  </div>
                  {platform.connected && (
                    <>
                      <p className="platform-settings-card__description">
                        {config.connectionSummary}
                      </p>
                      <PlatformToolTags tools={config.mcpTools} />
                    </>
                  )}
                </div>
                <div className="platform-settings-card__actions">
                  <button
                    type="button"
                    className="platform-settings-card__remove"
                    onClick={() => setRemoveTarget(platform)}
                    disabled={isBusy}
                    aria-label={`Remove ${platform.name}`}
                  >
                    Remove
                  </button>
                  <PlatformConnectionToggle
                    checked={platform.connected}
                    disabled={isBusy}
                    onChange={(on) => handleToggle(platform, on)}
                    label={
                      isAuthOpen
                        ? `Connecting ${platform.name}`
                        : `${platform.connected ? 'Disconnect' : 'Connect'} ${platform.name}`
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
        )}
      </section>

      <section className="settings-section settings-section--compact" aria-labelledby="notifications-heading">
        <h2 id="notifications-heading" className="settings-section__title">
          Notifications
        </h2>
        <p className="settings-section__sub settings-section__sub--inline">Coming soon.</p>
      </section>

      <section className="settings-section settings-section--compact" aria-labelledby="account-heading">
        <h2 id="account-heading" className="settings-section__title">
          Account
        </h2>
        <p className="settings-section__sub settings-section__sub--inline">Coming soon.</p>
      </section>

      {marketplaceOpen && (
        <PlatformMarketplaceModal
          platforms={platforms}
          onClose={closeMarketplace}
          onConnectMcp={startConnect}
          onConnectManual={startManualConnect}
          onNotifyComingSoon={(name) =>
            setLocalToast(`${name} isn’t available yet — we’ll notify you when it is.`)
          }
        />
      )}

      {authPlatform && (
        <McpAuthModal
          platform={authPlatform}
          onComplete={(meta) => completeConnect(authPlatform.id, meta)}
          onCancel={cancelConnect}
        />
      )}

      {manualPlatform && (
        <ManualConnectModal
          platform={manualPlatform}
          onComplete={(meta) => completeManualConnect(manualPlatform.id, meta)}
          onCancel={cancelManualConnect}
        />
      )}

      {removeTarget && (
        <RemovePlatformDialog
          platform={removeTarget}
          onConfirm={() => {
            removePlatform(removeTarget.id);
            setRemoveTarget(null);
          }}
          onCancel={() => setRemoveTarget(null)}
        />
      )}

      {activeToast && (
        <div className="settings-toast" role="status" aria-live="polite">
          {activeToast}
        </div>
      )}
    </div>
  );
}
