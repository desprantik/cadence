import { useEffect } from 'react';
import { useLearner } from '../context/LearnerContext';
import SocialProofStrip from './SocialProofStrip';
import { getLearnerRank } from '../data/socialProof';
import { fireConfetti } from '../utils/confetti';

export default function CelebrationOverlay({ onDismiss }) {
  const { learner, overallProgress } = useLearner();
  const rank = getLearnerRank(overallProgress, learner.streak.current);

  useEffect(() => {
    fireConfetti(2800);
    const timer = setTimeout(onDismiss, 3200);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="celebration-overlay" role="dialog" aria-live="polite" aria-label="Session complete">
      <div className="celebration-overlay__card">
        <p className="celebration-overlay__eyebrow">Session complete</p>
        <h2 className="celebration-overlay__title">Nice focus, {learner.name}!</h2>
        <p className="celebration-overlay__sub">
          Streak extended · +1 lesson today
        </p>
        <p className="celebration-overlay__rank">
          You&apos;re in the <strong>{rank.label}</strong> of learners this week
        </p>
        <SocialProofStrip compact />
      </div>
    </div>
  );
}
