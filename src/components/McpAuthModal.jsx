import { useEffect, useState } from 'react';
import PlatformLogo from './PlatformLogo';
import {
  getAuthConfig,
  HANDSHAKE_STEPS,
} from '../data/platformAuth';

const STEP_ORDER = ['redirect', 'signin', 'consent', 'handshake', 'sync', 'success'];

function FakeUrlBar({ host, path }) {
  return (
    <div className="mcp-auth__url-bar" aria-hidden="true">
      <span className="mcp-auth__url-lock">🔒</span>
      <span className="mcp-auth__url-text">
        https://{host}
        {path}
      </span>
    </div>
  );
}

function RedirectStep({ platform, config, onNext }) {
  useEffect(() => {
    const t = setTimeout(onNext, 1400);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <div className="mcp-auth__step">
      <FakeUrlBar host="app.cadence.learn" path="/oauth/start" />
      <div className="mcp-auth__redirect">
        <div className="mcp-auth__spinner" aria-hidden="true" />
        <p className="mcp-auth__redirect-title">Redirecting to {platform.name}…</p>
        <p className="mcp-auth__redirect-sub">
          MCP client initiating {config.authLabel} authorization
        </p>
      </div>
    </div>
  );
}

function SignInStep({ platform, config, onNext, onCancel }) {
  const [email, setEmail] = useState('learner@example.com');
  const [password, setPassword] = useState('••••••••');
  const [apiKey, setApiKey] = useState('sk_demo_••••••••••••');
  const isGoogle = config.authType === 'google_oauth';
  const isDemo = config.authType === 'demo';

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ account: email || 'demo@cadence.learn' });
  };

  return (
    <div className="mcp-auth__step">
      <FakeUrlBar host={config.authorizeHost} path="/oauth/authorize" />
      <div className="mcp-auth__signin-card">
        <div className="mcp-auth__signin-brand">
          <PlatformLogo platform={platform.name} size={36} />
          <h3 className="mcp-auth__signin-title">{platform.name}</h3>
        </div>

        {config.partnershipNote && (
          <p className="mcp-auth__notice">{config.partnershipNote}</p>
        )}

        <form className="mcp-auth__form" onSubmit={handleSubmit}>
          {isGoogle && (
            <button type="submit" className="mcp-auth__google-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {config.signInLabel}
            </button>
          )}

          {isDemo && (
            <>
              <label className="mcp-auth__label" htmlFor="mcp-api-key">
                Demo API key
              </label>
              <input
                id="mcp-api-key"
                className="mcp-auth__input"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
            </>
          )}

          {!isGoogle && !isDemo && (
            <>
              <label className="mcp-auth__label" htmlFor="mcp-email">
                Email
              </label>
              <input
                id="mcp-email"
                className="mcp-auth__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <label className="mcp-auth__label" htmlFor="mcp-password">
                Password
              </label>
              <input
                id="mcp-password"
                className="mcp-auth__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </>
          )}

          <p className="mcp-auth__sim-note">
            Simulation only — credentials are not sent anywhere.
          </p>

          <div className="mcp-auth__actions">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {isGoogle ? 'Continue' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConsentStep({ platform, config, account, onNext, onCancel }) {
  return (
    <div className="mcp-auth__step">
      <FakeUrlBar host={config.authorizeHost} path="/oauth/consent" />
      <div className="mcp-auth__consent">
        <div className="mcp-auth__consent-header">
          <PlatformLogo platform={platform.name} size={32} />
          <div>
            <p className="mcp-auth__consent-app">Cadence</p>
            <p className="mcp-auth__consent-sub">wants to access your {platform.name} account</p>
          </div>
        </div>

        <p className="mcp-auth__consent-account">Signed in as {account}</p>

        <ul className="mcp-auth__scope-list">
          {config.scopes.map((scope) => (
            <li key={scope.id} className="mcp-auth__scope-item">
              <span className="mcp-auth__scope-check" aria-hidden="true">✓</span>
              {scope.label}
            </li>
          ))}
        </ul>

        <div className="mcp-auth__mcp-meta">
          <span>MCP server</span>
          <code>{platform.mcpServerId}</code>
          <span>Transport</span>
          <code>{config.transport}</code>
        </div>

        <div className="mcp-auth__actions">
          <button type="button" className="btn" onClick={onCancel}>
            Deny
          </button>
          <button type="button" className="btn btn--primary" onClick={onNext}>
            Allow access
          </button>
        </div>
      </div>
    </div>
  );
}

function HandshakeStep({ config, onNext }) {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (doneCount >= HANDSHAKE_STEPS.length) {
      const t = setTimeout(onNext, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDoneCount((c) => c + 1), 700);
    return () => clearTimeout(t);
  }, [doneCount, onNext]);

  return (
    <div className="mcp-auth__step">
      <div className="mcp-auth__handshake">
        <p className="mcp-auth__handshake-title">MCP handshake</p>
        <p className="mcp-auth__handshake-endpoint">
          <code>{config.mcpEndpoint}</code>
        </p>
        <ul className="mcp-auth__handshake-list">
          {HANDSHAKE_STEPS.map((step, i) => {
            const state =
              i < doneCount ? 'done' : i === doneCount ? 'active' : 'pending';
            return (
              <li key={step.id} className={`mcp-auth__handshake-item mcp-auth__handshake-item--${state}`}>
                <span className="mcp-auth__handshake-icon" aria-hidden="true">
                  {state === 'done' ? '✓' : state === 'active' ? '…' : '○'}
                </span>
                {step.label}
              </li>
            );
          })}
        </ul>
        {doneCount >= HANDSHAKE_STEPS.length && (
          <ul className="mcp-auth__tools-list">
            {config.mcpTools.map((tool) => (
              <li key={tool}>
                <code>{tool}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SyncStep({ config, onNext }) {
  const [progress, setProgress] = useState(0);
  const { courses, inProgress, completed } = config.syncPreview;

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onNext, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress((p) => Math.min(p + 12, 100)), 180);
    return () => clearTimeout(t);
  }, [progress, onNext]);

  return (
    <div className="mcp-auth__step">
      <div className="mcp-auth__sync">
        <p className="mcp-auth__sync-title">Syncing your library…</p>
        <div className="mcp-auth__sync-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="mcp-auth__sync-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="mcp-auth__sync-meta">
          {progress < 100
            ? 'Pulling enrollments and progress via MCP tools…'
            : `Found ${courses} courses · ${inProgress} in progress · ${completed} completed`}
        </p>
      </div>
    </div>
  );
}

function SuccessStep({ platform, config, account, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="mcp-auth__step mcp-auth__step--success">
      <div className="mcp-auth__success-icon" aria-hidden="true">✓</div>
      <p className="mcp-auth__success-title">{platform.name} connected</p>
      <p className="mcp-auth__success-sub">
        {account} · {config.mcpTools.length} MCP tools · {config.syncPreview.courses} courses synced
      </p>
    </div>
  );
}

export default function McpAuthModal({ platform, onComplete, onCancel }) {
  const config = getAuthConfig(platform.id);
  const [stepIndex, setStepIndex] = useState(0);
  const [account, setAccount] = useState('learner@example.com');
  const step = STEP_ORDER[stepIndex];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && step !== 'handshake' && step !== 'sync') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, step]);

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));

  const handleSignIn = ({ account: acct }) => {
    setAccount(acct);
    goNext();
  };

  const handleDone = () => {
    onComplete({
      connectedAccount: account,
      authMethod: config.authType,
      authLabel: config.authLabel,
      mcpTools: config.mcpTools,
      syncedCourses: config.syncPreview.courses,
      coursesInProgress: config.syncPreview.inProgress,
      coursesCompleted: config.syncPreview.completed,
    });
  };

  return (
    <div className="mcp-auth" role="presentation">
      <button
        type="button"
        className="mcp-auth__backdrop"
        onClick={step === 'handshake' || step === 'sync' ? undefined : onCancel}
        aria-label="Close connection dialog"
        disabled={step === 'handshake' || step === 'sync'}
      />
      <div
        className="mcp-auth__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mcp-auth-title"
      >
        <header className="mcp-auth__header">
          <p id="mcp-auth-title" className="mcp-auth__header-title">
            Connect {platform.name} via MCP
          </p>
          <p className="mcp-auth__header-sub">
            Step {stepIndex + 1} of {STEP_ORDER.length} · {config.authLabel}
          </p>
        </header>

        <div className="mcp-auth__body">
          {step === 'redirect' && (
            <RedirectStep platform={platform} config={config} onNext={goNext} />
          )}
          {step === 'signin' && (
            <SignInStep
              platform={platform}
              config={config}
              onNext={handleSignIn}
              onCancel={onCancel}
            />
          )}
          {step === 'consent' && (
            <ConsentStep
              platform={platform}
              config={config}
              account={account}
              onNext={goNext}
              onCancel={onCancel}
            />
          )}
          {step === 'handshake' && (
            <HandshakeStep config={config} onNext={goNext} />
          )}
          {step === 'sync' && (
            <SyncStep config={config} onNext={goNext} />
          )}
          {step === 'success' && (
            <SuccessStep
              platform={platform}
              config={config}
              account={account}
              onDone={handleDone}
            />
          )}
        </div>
      </div>
    </div>
  );
}
