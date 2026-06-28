import { useEffect, useState } from 'react';
import PlatformLogo from './PlatformLogo';
import { getAuthConfig } from '../data/platformAuth';
import { getMarketplacePlatform } from '../data/platformMarketplace';

export default function ManualConnectModal({ platform, onComplete, onCancel }) {
  const catalog = getMarketplacePlatform(platform.id);
  const config = getAuthConfig(platform.id);
  const [label, setLabel] = useState(platform.name);
  const [sourceUrl, setSourceUrl] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      connectedAccount: label.trim() || platform.name,
      manualSourceUrl: sourceUrl.trim() || null,
      manualNote: note.trim() || null,
      authMethod: 'manual',
      authLabel: 'Manually added',
      mcpTools: config.mcpTools?.slice(0, 4) ?? [],
      syncedCourses: config.syncPreview?.courses ?? 1,
      coursesInProgress: config.syncPreview?.inProgress ?? 1,
      coursesCompleted: config.syncPreview?.completed ?? 0,
    });
  };

  return (
    <div className="mcp-auth" role="presentation">
      <button
        type="button"
        className="mcp-auth__backdrop"
        onClick={onCancel}
        aria-label="Close manual connect dialog"
      />
      <div
        className="mcp-auth__panel manual-connect-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-connect-title"
      >
        <header className="mcp-auth__header">
          <div className="manual-connect-modal__brand">
            <PlatformLogo platform={platform.name} size={28} />
            <div>
              <p id="manual-connect-title" className="mcp-auth__header-title">
                Add {platform.name} manually
              </p>
              <p className="mcp-auth__header-sub">No MCP sync — you track progress in Cadence</p>
            </div>
          </div>
        </header>

        <form className="manual-connect-modal__body" onSubmit={handleSubmit}>
          <p className="manual-connect-modal__intro">
            {catalog?.description ?? config.partnershipNote}
          </p>

          <label className="mcp-auth__label" htmlFor="manual-label">
            Display name
          </label>
          <input
            id="manual-label"
            className="mcp-auth__input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={platform.name}
          />

          <label className="mcp-auth__label" htmlFor="manual-url">
            Profile or course URL <span className="manual-connect-modal__optional">(optional)</span>
          </label>
          <input
            id="manual-url"
            className="mcp-auth__input"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://…"
          />

          <label className="mcp-auth__label" htmlFor="manual-note">
            Note <span className="manual-connect-modal__optional">(optional)</span>
          </label>
          <textarea
            id="manual-note"
            className="mcp-auth__input manual-connect-modal__textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What are you learning on this platform?"
          />

          <p className="mcp-auth__sim-note">
            Simulation only — saved locally. You can switch to MCP later if available.
          </p>

          <div className="mcp-auth__actions">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Add platform
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
