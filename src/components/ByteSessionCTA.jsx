import { useLearner } from '../context/LearnerContext';
import SocialProofStrip from './SocialProofStrip';
import { sessionHref } from '../utils/routes';

export default function ByteSessionCTA() {
  const { learner, completedToday } = useLearner();

  return (
    <aside className="byte-cta" aria-label="Focus session">
      <div className="byte-cta__streak">
        <span className="byte-cta__streak-label">Streak</span>
        <span className="byte-cta__streak-value">
          {learner.streak.current}
          <span className="byte-cta__streak-goal">/{learner.streak.goal}</span>
        </span>
      </div>

      <h3 className="byte-cta__title">5-min focus</h3>
      <p className="byte-cta__copy">3 quick bytes across your topics</p>

      <SocialProofStrip compact />

      <p className="byte-cta__status">
        <span
          className={`byte-cta__dot${
            completedToday ? ' byte-cta__dot--done' : ' byte-cta__dot--ready'
          }`}
          aria-hidden="true"
        />
        {completedToday ? 'Completed today' : 'Ready'}
      </p>

      <a href={sessionHref()} className="byte-cta__btn">
        Start session
      </a>
    </aside>
  );
}
