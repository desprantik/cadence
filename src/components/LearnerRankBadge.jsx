import { getLearnerRank } from '../data/socialProof';
import { useLearner } from '../context/LearnerContext';

export default function LearnerRankBadge() {
  const { learner, overallProgress } = useLearner();
  const rank = getLearnerRank(overallProgress, learner.streak.current);

  return (
    <div className="learner-rank" aria-label={`You are in the ${rank.label} of learners`}>
      <span className="learner-rank__icon" aria-hidden="true">★</span>
      <span>
        You&apos;re in the <strong>{rank.label}</strong> of learners
      </span>
    </div>
  );
}
