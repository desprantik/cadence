import { useEffect, useState, useCallback } from 'react';
import AnimatedNumber from '../components/AnimatedNumber';
import ByteSessionCTA from '../components/ByteSessionCTA';
import CourseModal from '../components/CourseModal';
import CelebrationOverlay from '../components/CelebrationOverlay';
import CourseCardOverlay from '../components/CourseCardOverlay';
import LearnerRankBadge from '../components/LearnerRankBadge';
import PlatformLogo from '../components/PlatformLogo';
import SocialProofStrip from '../components/SocialProofStrip';
import StarRating from '../components/StarRating';
import { useLearner } from '../context/LearnerContext';
import { getProgressColor } from '../utils/progressColor';
import { getCourseRating } from '../data/socialProof';
import {
  completedCourses,
  inProgressCourses,
  platformColors,
  platformProgress,
  recommendations,
  stats,
} from '../data/learner';
import { platformHref } from '../utils/routes';

const ARC_HERO = {
  radius: 112,
  stroke: 11,
  viewBox: '0 0 280 152',
  path: 'M 28 132 A 112 112 0 0 1 252 132',
  ringHeight: 148,
  width: 300,
  fontSize: 58,
};

function ArcGauge({
  percent,
  gradientStops,
  gradientId,
}) {
  const [animated, setAnimated] = useState(false);
  const arcLength = Math.PI * ARC_HERO.radius;
  const offset = arcLength - (percent / 100) * arcLength;
  const gradKey = gradientId ?? 'arc-hero';

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="arc-gauge" style={{ width: ARC_HERO.width }}>
      <div
        className="arc-gauge__ring"
        style={{ height: ARC_HERO.ringHeight }}
      >
        <svg viewBox={ARC_HERO.viewBox} className="arc-svg" aria-hidden="true">
          {gradientStops && (
            <defs>
              <linearGradient id={gradKey} x1="0%" y1="0%" x2="100%" y2="0%">
                {gradientStops.map((stop) => (
                  <stop
                    key={stop.offset}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            </defs>
          )}
          <path
            className="arc-track"
            d={ARC_HERO.path}
            fill="none"
            strokeWidth={ARC_HERO.stroke}
          />
          <path
            className="arc-fill"
            d={ARC_HERO.path}
            fill="none"
            stroke={`url(#${gradKey})`}
            strokeWidth={ARC_HERO.stroke}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={animated ? offset : arcLength}
          />
        </svg>
        <span
          className="arc-percent"
          style={{ fontSize: ARC_HERO.fontSize }}
        >
          {percent}%
        </span>
      </div>
    </div>
  );
}

function MiniRing({ percent, color, size = 44 }) {
  const [animated, setAnimated] = useState(false);
  const radius = 17;
  const stroke = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      className="mini-ring"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-hidden="true"
    >
      <circle
        className="mini-ring__track"
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        strokeWidth={stroke}
      />
      <circle
        className="mini-ring__fill"
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={animated ? offset : circumference}
        transform="rotate(-90 22 22)"
      />
    </svg>
  );
}

function PlatformDisclosure() {
  const [active, setActive] = useState(platformProgress[0].platform);
  const selected = platformProgress.find((item) => item.platform === active);

  return (
    <div className="platform-disclosure">
      <div className="platform-disclosure__chips" role="tablist" aria-label="Platform progress">
        {platformProgress.map((item) => {
          const progressColor = getProgressColor(item.percent);
          const isActive = active === item.platform;

          return (
            <button
              key={item.platform}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`platform-chip${isActive ? ' platform-chip--active' : ''}`}
              onClick={() => setActive(item.platform)}
              style={{ '--chip-color': progressColor }}
            >
              <span className="platform-chip__ring">
                <MiniRing percent={item.percent} color={progressColor} />
                <PlatformLogo platform={item.platform} size={20} />
              </span>
              <span className="platform-chip__pct">{item.percent}%</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <>
          <div className="platform-disclosure__panel platform-disclosure__panel--open" role="tabpanel">
            <div className="platform-disclosure__inner">
              <div className="platform-panel" key={selected.platform}>
                <div className="platform-panel__top">
                  <div className="platform-panel__identity">
                    <PlatformLogo platform={selected.platform} size={22} />
                    <span className="platform-panel__name">{selected.platform}</span>
                  </div>
                  <span
                    className="platform-panel__pct"
                    style={{ color: getProgressColor(selected.percent) }}
                  >
                    {selected.percent}%
                  </span>
                </div>
                <div className="platform-panel__bottom">
                  <div className="platform-panel__bar">
                    <div
                      className="platform-panel__fill"
                      style={{
                        width: `${selected.percent}%`,
                        backgroundColor: getProgressColor(selected.percent),
                      }}
                    />
                  </div>
                  <p className="platform-panel__meta">
                    <strong>{selected.courses}</strong> courses ·{' '}
                    <strong>{selected.completed}</strong> done ·{' '}
                    <strong>{selected.inProgress}</strong> active
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero__stat-badges">
            <a
              href={platformHref(selected.platform, 'enrolled')}
              className="stat-badge stat-badge--cta"
            >
              <strong>{selected.courses}</strong> enrolled
            </a>
            <a
              href={platformHref(selected.platform, 'in-progress')}
              className="stat-badge stat-badge--cta"
            >
              <strong>{selected.inProgress}</strong> in progress
            </a>
            <a
              href={platformHref(selected.platform, 'completed')}
              className="stat-badge stat-badge--cta"
            >
              <strong>{selected.completed}</strong> completed
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function ProgressCluster({ overallProgress }) {
  return (
    <div className="progress-cluster">
      <ArcGauge
        key={overallProgress}
        percent={overallProgress}
        gradientId="arc-hero"
        gradientStops={[
          { offset: '0%', color: '#E8734A' },
          { offset: '55%', color: '#F0A030' },
          { offset: '100%', color: '#F5C842' },
        ]}
      />
      <PlatformDisclosure />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function CourseCardTopRow({ platform, timeLabel }) {
  if (!timeLabel) {
    return (
      <div className="course-card__top-row">
        <PlatformLogo platform={platform} size={18} />
      </div>
    );
  }

  return (
    <div className="course-card__top-row">
      <PlatformLogo platform={platform} size={18} />
      <span className="course-card__time">{timeLabel}</span>
    </div>
  );
}

function CourseImage({ src, alt, completed = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`course-image${completed ? ' course-image--completed' : ''}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="course-image__fallback" aria-hidden="true" />
      )}
      {completed && (
        <span className="completed-check" aria-label="Completed">
          <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
            <path
              d="M3 8.5l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

function openCourseKey(e, onOpen, course) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onOpen(course);
  }
}

function InProgressCard({ course, onOpen, onNotify }) {
  const { rating, reviews } = getCourseRating(course.id);

  return (
    <article
      className="course-card course-card--clickable"
      onClick={() => onOpen(course)}
      onKeyDown={(e) => openCourseKey(e, onOpen, course)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${course.title}`}
    >
      <div className="course-card__media">
        <CourseImage src={course.image} alt={course.title} />
        <CourseCardOverlay course={course} onNotify={onNotify} />
      </div>
      <div className="course-card__body">
        <CourseCardTopRow platform={course.platform} timeLabel={course.timeToComplete} />
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__meta">{course.instructor}</p>
        <StarRating rating={rating} reviews={reviews} size="xs" />
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <div className="course-card__footer">
          <span className="course-card__percent">{course.progress}%</span>
          <span className="course-card__link">
            Continue
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}

function RecommendationCard({ course, onOpen, onNotify }) {
  const { rating, reviews } = getCourseRating(course.id);

  return (
    <article
      className="rec-card rec-card--clickable"
      onClick={() => onOpen(course)}
      onKeyDown={(e) => openCourseKey(e, onOpen, course)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${course.title}`}
    >
      <div className="rec-card__media">
        <CourseImage src={course.image} alt={course.title} />
        <CourseCardOverlay course={course} onNotify={onNotify} />
      </div>
      <div className="rec-card__body">
        <CourseCardTopRow platform={course.platform} timeLabel={course.duration} />
        <h3 className="rec-card__title">{course.title}</h3>
        <StarRating rating={rating} reviews={reviews} size="xs" />
      </div>
    </article>
  );
}

function CompletedCard({ course, onOpen, onNotify }) {
  return (
    <article
      className="course-card course-card--completed course-card--clickable"
      onClick={() => onOpen(course)}
      onKeyDown={(e) => openCourseKey(e, onOpen, course)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${course.title}`}
    >
      <div className="course-card__media">
        <CourseImage src={course.image} alt={course.title} completed />
        <CourseCardOverlay course={course} onNotify={onNotify} />
      </div>
      <div className="course-card__body">
        <CourseCardTopRow platform={course.platform} timeLabel={course.timeToComplete} />
        <h3 className="course-card__title">{course.title}</h3>
        <span className="course-card__date">Completed {course.completedDate}</span>
      </div>
    </article>
  );
}


export default function Dashboard({ celebrate = false }) {
  const greeting = getGreeting();
  const [activeCourse, setActiveCourse] = useState(null);
  const [actionToast, setActionToast] = useState(null);
  const {
    learner,
    overallProgress,
    celebrating,
    previousStats,
    clearCelebration,
  } = useLearner();

  const showCelebration = celebrate && celebrating;

  useEffect(() => {
    if (!actionToast) return undefined;
    const t = setTimeout(() => setActionToast(null), 2600);
    return () => clearTimeout(t);
  }, [actionToast]);

  const handleCourseNotify = useCallback((message) => {
    setActionToast(message);
  }, []);

  const handleDismissCelebration = useCallback(() => {
    clearCelebration();
    if (window.location.hash.includes('celebrate=1')) {
      window.location.hash = '#/';
    }
  }, [clearCelebration]);

  const animFrom = previousStats
    ? {
        streak: previousStats.streakCurrent,
        today: previousStats.streakToday,
        hours: previousStats.totalHours,
        progress: previousStats.overallProgress,
      }
    : null;

  return (
    <div className="page">
      {activeCourse && (
        <CourseModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
        />
      )}
      {showCelebration && (
        <CelebrationOverlay onDismiss={handleDismissCelebration} />
      )}
      <div className="dashboard">
        {/* Zone A — Hero */}
        <header className="zone zone-a hero">
          <div className="hero__left">
            <p className="eyebrow">Cadence · Design learning</p>
            <h1 className="welcome-heading">
              {greeting}, {learner.name}.
              <br />
              <span className="welcome-heading__accent">
                You are killing it.
              </span>
            </h1>

            <LearnerRankBadge />

            <SocialProofStrip />

            <div className="streak-bar">
              <div className="streak-chip streak-chip--hero">
                <span className="streak-chip__label">Streak</span>
                <span className="streak-chip__value">
                  <span className="streak-chip__big">
                    <AnimatedNumber
                      value={learner.streak.current}
                      from={animFrom?.streak}
                    />
                  </span>
                  <span className="streak-chip__small">
                    /{learner.streak.goal}
                  </span>
                  {showCelebration && (
                    <span className="streak-delta">+1</span>
                  )}
                </span>
              </div>
              <div className="streak-chip">
                <span className="streak-chip__label">Today</span>
                <span className="streak-chip__value">
                  <span className="streak-chip__big">
                    <AnimatedNumber
                      value={learner.streak.today}
                      from={animFrom?.today}
                    />
                  </span>
                  <span className="streak-chip__small"> lessons</span>
                  {showCelebration && (
                    <span className="streak-delta">+1</span>
                  )}
                </span>
              </div>
              <div className="streak-chip">
                <span className="streak-chip__label">Total</span>
                <span className="streak-chip__value">
                  <span className="streak-chip__big">
                    <AnimatedNumber
                      value={learner.streak.totalHours}
                      from={animFrom?.hours}
                      decimals={1}
                    />
                  </span>
                  <span className="streak-chip__small"> hrs</span>
                </span>
              </div>
            </div>
          </div>

          <div className="hero__right">
            <ProgressCluster overallProgress={overallProgress} />
          </div>
        </header>

        {/* Zone B */}
        <section
          className="zone zone-b"
          aria-label="Progress overview"
        >
          <div className="bento__courses">
            <div className="bento__courses-header">
              <div>
                <h2 className="bento__title">Pick up where you left off</h2>
                <p className="bento__nudge">{learner.progressNudge}</p>
              </div>
              <span className="bento__subtitle">3 active courses</span>
            </div>
            <div className="bento__courses-body">
              <div className="in-progress-grid">
                {inProgressCourses.map((course) => (
                  <InProgressCard
                    key={course.id}
                    course={course}
                    onOpen={setActiveCourse}
                    onNotify={handleCourseNotify}
                  />
                ))}
              </div>
              <ByteSessionCTA />
            </div>
          </div>
        </section>

        {/* Zone C */}
        <section className="zone zone-c" aria-label="Recommendations">
          <div className="section-header">
            <div>
              <h2 className="section-title">Recommended for you</h2>
              <p className="section-subtitle">
                Based on your UX &amp; brand design path
              </p>
            </div>
            <a
              href="#/profile"
              className="section-link"
              aria-label="See all recommendations"
            >
              View all →
            </a>
          </div>

          <div className="rec-row">
            {recommendations.map((course) => (
              <RecommendationCard
                key={course.id}
                course={course}
                onOpen={setActiveCourse}
                onNotify={handleCourseNotify}
              />
            ))}
          </div>
        </section>

        {/* Zone D */}
        <section className="zone zone-d" aria-label="Completed courses">
          <div className="section-header">
            <div>
              <h2 className="section-title">You have completed so far</h2>
              <p className="section-subtitle">
                {stats.completed} design courses across 4 platforms
              </p>
            </div>
            <a href="#/library?status=completed" className="section-link section-link--count">
              {completedCourses.length} →
            </a>
          </div>

          <div className="completed-grid">
            {completedCourses.map((course) => (
              <CompletedCard
                key={course.id}
                course={course}
                onOpen={setActiveCourse}
                onNotify={handleCourseNotify}
              />
            ))}
          </div>
        </section>
      </div>

      {actionToast && (
        <div className="settings-toast" role="status" aria-live="polite">
          {actionToast}
        </div>
      )}
    </div>
  );
}
