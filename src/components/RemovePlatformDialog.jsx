import { useEffect } from 'react';
import PlatformLogo from './PlatformLogo';

export default function RemovePlatformDialog({ platform, onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onCancel]);

  return (
    <div className="remove-platform-dialog" role="presentation">
      <button
        type="button"
        className="remove-platform-dialog__backdrop"
        onClick={onCancel}
        aria-label="Close remove dialog"
      />
      <div
        className="remove-platform-dialog__panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="remove-platform-title"
        aria-describedby="remove-platform-desc"
      >
        <div className="remove-platform-dialog__icon" aria-hidden="true">!</div>
        <div className="remove-platform-dialog__brand">
          <PlatformLogo platform={platform.name} size={28} />
          <h2 id="remove-platform-title" className="remove-platform-dialog__title">
            Remove {platform.name}?
          </h2>
        </div>

        <p id="remove-platform-desc" className="remove-platform-dialog__lead">
          This removes {platform.name} from your connections and clears all synced data.
        </p>

        <ul className="remove-platform-dialog__warnings">
          <li>Synced courses and progress for {platform.name} will be deleted locally</li>
          <li>Streaks and recommendations may change without this data</li>
          {platform.connectionMode === 'mcp' && (
            <li>MCP access tokens will be revoked — you’ll need to reconnect</li>
          )}
          {platform.connectionMode === 'manual' && (
            <li>Manual entries and notes for this platform will be lost</li>
          )}
          <li>Re-add anytime from Connect platform in the marketplace</li>
        </ul>

        <div className="remove-platform-dialog__actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger-solid" onClick={onConfirm}>
            Remove platform
          </button>
        </div>
      </div>
    </div>
  );
}
