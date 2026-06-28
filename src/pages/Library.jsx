import { useEffect, useState } from 'react';
import CourseCardOverlay from '../components/CourseCardOverlay';
import CourseModal from '../components/CourseModal';
import PlatformLogo from '../components/PlatformLogo';
import StarRating from '../components/StarRating';
import { catalog } from '../data/catalog';
import { getCourseRating } from '../data/socialProof';
import { usePlatforms } from '../context/PlatformContext';
import { getProgressColor } from '../utils/progressColor';
import { libraryHref, platformHref } from '../utils/routes';

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'saved', label: 'Saved' },
];

const platformNames = ['Udemy', 'Coursera', 'Skillshare', 'YouTube'];

function statusHref(platform, status) {
  const base = libraryHref(platform);
  if (status === 'all') return base;
  return `${base}?status=${status}`;
}

function filterCourses(platform, status, connectedPlatforms) {
  return catalog.filter((item) => {
    if (platform && item.platform !== platform) return false;
    const platformConnected = connectedPlatforms.find(
      (p) => p.name === item.platform
    )?.connected;
    if (item.subscribed && !platformConnected) return false;
    if (status === 'all') return item.subscribed || item.status === 'saved';
    if (status === 'saved') return item.status === 'saved';
    return item.status === status;
  });
}

function LibraryCard({ course, onOpen, onNotify }) {
  const { rating, reviews } = getCourseRating(course.id);

  return (
    <article
      className="course-card course-card--clickable"
      onClick={() => onOpen(course)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(course);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${course.title}`}
    >
      <div className="course-card__media">
        <img
          src={course.image}
          alt=""
          className="course-image"
          loading="lazy"
        />
        <CourseCardOverlay course={course} onNotify={onNotify} />
      </div>
      <div className="course-card__body">
        <div className="course-card__top-row">
          <PlatformLogo platform={course.platform} size={18} />
          {course.timeToComplete && (
            <span className="course-card__time">{course.timeToComplete}</span>
          )}
          {!course.timeToComplete && course.duration && (
            <span className="course-card__time">{course.duration}</span>
          )}
        </div>
        <h3 className="course-card__title">{course.title}</h3>
        <StarRating rating={rating} reviews={reviews} size="xs" />
        {course.progress != null && (
          <div className="course-card__footer">
            <span
              className="course-card__percent"
              style={{ color: getProgressColor(course.progress) }}
            >
              {course.progress}%
            </span>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={course.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar__fill"
                style={{
                  width: `${course.progress}%`,
                  background: getProgressColor(course.progress),
                }}
              />
            </div>
          </div>
        )}
        {course.completedDate && (
          <span className="course-card__date">
            Completed {course.completedDate}
          </span>
        )}
        {course.status === 'saved' && (
          <span className="course-card__meta">Saved for later</span>
        )}
      </div>
    </article>
  );
}

export default function Library({ platform, status = 'all' }) {
  const { platforms } = usePlatforms();
  const courses = filterCourses(platform, status, platforms);
  const [activeCourse, setActiveCourse] = useState(null);
  const [actionToast, setActionToast] = useState(null);

  useEffect(() => {
    if (!actionToast) return undefined;
    const t = setTimeout(() => setActionToast(null), 2600);
    return () => clearTimeout(t);
  }, [actionToast]);

  return (
    <div className="page-content">
      {activeCourse && (
        <CourseModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
        />
      )}
      <header className="page-header">
        <p className="eyebrow">Library</p>
        <h1 className="page-header__title">Your learning library</h1>
        <p className="page-header__sub">
          All synced content across platforms.{' '}
          <a href="#/settings">Manage platforms →</a>
        </p>
      </header>

      <div className="filter-row" role="group" aria-label="Filter by platform">
        <a
          href={statusHref(null, status)}
          className={`filter-chip${!platform ? ' filter-chip--active' : ''}`}
        >
          All platforms
        </a>
        {platformNames.map((name) => (
          <a
            key={name}
            href={statusHref(name, status)}
            className={`filter-chip${
              platform === name ? ' filter-chip--active' : ''
            }`}
          >
            {name}
          </a>
        ))}
      </div>

      <div className="filter-row" role="tablist" aria-label="Filter by status">
        {statusTabs.map((tab) => (
          <a
            key={tab.id}
            href={statusHref(platform, tab.id)}
            role="tab"
            aria-selected={status === tab.id}
            className={`filter-chip${
              status === tab.id ? ' filter-chip--active' : ''
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {platform && (
        <p className="page-header__sub" style={{ marginBottom: 16 }}>
          <a href={platformHref(platform, 'in-progress')}>
            View {platform} breakdown →
          </a>
        </p>
      )}

      {courses.length > 0 ? (
        <div className="in-progress-grid">
          {courses.map((course) => (
            <LibraryCard
              key={course.id}
              course={course}
              onOpen={setActiveCourse}
              onNotify={setActionToast}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No courses match these filters.</p>
          <p style={{ marginTop: 8 }}>
            <a href="#/settings">Connect a platform</a> or try a different filter.
          </p>
        </div>
      )}
      {actionToast && (
        <div className="settings-toast" role="status" aria-live="polite">
          {actionToast}
        </div>
      )}
    </div>
  );
}
