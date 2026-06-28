import { useLiveActivity } from '../hooks/useLiveActivity';
import { formatReviewCount } from '../data/socialProof';

export default function SocialProofStrip({ compact = false }) {
  const { focusingNow, completedLast3h } = useLiveActivity();

  if (compact) {
    return (
      <p className="social-proof social-proof--compact">
        <span className="social-proof__live" aria-hidden="true" />
        <span>
          <strong>{focusingNow.toLocaleString()}</strong> focusing now
        </span>
      </p>
    );
  }

  return (
    <div className="social-proof" role="status" aria-live="polite">
      <span className="social-proof__live" aria-hidden="true" />
      <span>
        <strong>{focusingNow.toLocaleString()}</strong> focusing now
      </span>
      <span className="social-proof__sep" aria-hidden="true">·</span>
      <span>
        <strong>{formatReviewCount(completedLast3h)}</strong> completed in the last 3 hrs
      </span>
    </div>
  );
}
