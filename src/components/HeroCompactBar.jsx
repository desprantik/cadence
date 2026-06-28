import AnimatedNumber from './AnimatedNumber';
import { getLearnerRank } from '../data/socialProof';

function CompactStat({ label, value, suffix, decimals, from, dark }) {
  return (
    <div className={`hero-compact__stat${dark ? ' hero-compact__stat--dark' : ''}`}>
      <span className="hero-compact__stat-label">{label}</span>
      <span className="hero-compact__stat-value">
        <AnimatedNumber value={value} from={from} decimals={decimals ?? 0} />
        {suffix && <span className="hero-compact__stat-suffix">{suffix}</span>}
      </span>
    </div>
  );
}

export default function HeroCompactBar({
  name,
  greeting,
  learner,
  overallProgress,
  animFrom,
}) {
  const rank = getLearnerRank(overallProgress, learner.streak.current);

  return (
    <div className="hero-compact">
      <div className="hero-compact__identity">
        <p className="hero-compact__greeting">
          {greeting}, <strong>{name}</strong>
        </p>
        <span className="hero-compact__rank">★ {rank.label}</span>
      </div>

      <div className="hero-compact__stats">
        <CompactStat
          label="Streak"
          value={learner.streak.current}
          suffix={`/${learner.streak.goal}`}
          from={animFrom?.streak}
          dark
        />
        <CompactStat
          label="Today"
          value={learner.streak.today}
          suffix=" lessons"
          from={animFrom?.today}
        />
        <CompactStat
          label="Total"
          value={learner.streak.totalHours}
          suffix=" hrs"
          decimals={1}
          from={animFrom?.hours}
        />
      </div>

      <div className="hero-compact__progress" aria-label={`${overallProgress}% overall progress`}>
        <svg className="hero-compact__arc" viewBox="0 0 56 36" aria-hidden="true">
          <path
            d="M 6 32 A 22 22 0 0 1 50 32"
            fill="none"
            stroke="var(--border)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 6 32 A 22 22 0 0 1 50 32"
            fill="none"
            stroke="url(#compact-arc-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="69.1"
            strokeDashoffset={69.1 - (overallProgress / 100) * 69.1}
          />
          <defs>
            <linearGradient id="compact-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8734A" />
              <stop offset="100%" stopColor="#F5C842" />
            </linearGradient>
          </defs>
        </svg>
        <span className="hero-compact__pct">
          <AnimatedNumber value={overallProgress} from={animFrom?.progress} />%
        </span>
      </div>
    </div>
  );
}
