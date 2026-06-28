import { useEffect } from 'react';
import PlatformLogo from './PlatformLogo';
import StarRating from './StarRating';
import { getCourseTopics, splitTopicsByStatus } from '../data/courseTopics';
import { platformColors } from '../data/learner';
import { getCourseRating } from '../data/socialProof';
import { getProgressColor } from '../utils/progressColor';

function TopicRow({ topic }) {
  const done = topic.status === 'completed';

  return (
    <li className={`course-modal__topic${done ? ' course-modal__topic--done' : ''}`}>
      <span className="course-modal__topic-icon" aria-hidden="true">
        {done ? (
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
            <path
              d="M3 8.5l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="course-modal__topic-ring" />
        )}
      </span>
      <div className="course-modal__topic-body">
        <span className="course-modal__topic-title">{topic.title}</span>
        <span className="course-modal__topic-duration">{topic.duration}</span>
      </div>
      <span className={`course-modal__topic-status${done ? ' course-modal__topic-status--done' : ''}`}>
        {done ? 'Completed' : 'Upcoming'}
      </span>
    </li>
  );
}

export default function CourseModal({ course, onClose }) {
  const topics = getCourseTopics(course.id);
  const { completed, upcoming } = splitTopicsByStatus(topics);
  const { rating, reviews } = getCourseRating(course.id);
  const color = platformColors[course.platform] ?? '#888';
  const isLight = course.platform === 'Skillshare';
  const progress = 'progress' in course ? course.progress : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const nextTopic = upcoming[0];

  return (
    <div className="course-modal" role="presentation">
      <button
        type="button"
        className="course-modal__backdrop"
        onClick={onClose}
        aria-label="Close course view"
      />
      <div
        className="course-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
      >
        <button
          type="button"
          className="course-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="course-modal__hero">
          <img src={course.image} alt="" className="course-modal__image" />
          <div className="course-modal__hero-overlay">
            <span
              className="platform-badge"
              style={{
                backgroundColor: `${color}18`,
                color: isLight ? '#0a7a42' : color,
                borderColor: `${color}40`,
              }}
            >
              <PlatformLogo platform={course.platform} size={16} />
              {course.platform}
            </span>
          </div>
        </div>

        <div className="course-modal__content">
          <header className="course-modal__header">
            <h2 id="course-modal-title" className="course-modal__title">
              {course.title}
            </h2>
            {'instructor' in course && (
              <p className="course-modal__instructor">{course.instructor}</p>
            )}
            {'duration' in course && !('instructor' in course) && (
              <p className="course-modal__instructor">{course.duration}</p>
            )}
            <StarRating rating={rating} reviews={reviews} size="sm" />

            {progress != null && (
              <div className="course-modal__progress">
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{
                      width: `${progress}%`,
                      background: getProgressColor(progress),
                    }}
                  />
                </div>
                <span
                  className="course-modal__progress-label"
                  style={{ color: getProgressColor(progress) }}
                >
                  {progress}% complete · {completed.length} of {topics.length} topics done
                </span>
              </div>
            )}
          </header>

          <div className="course-modal__topics">
            {completed.length > 0 && (
              <section className="course-modal__section">
                <h3 className="course-modal__section-title">
                  Completed
                  <span className="course-modal__count">{completed.length}</span>
                </h3>
                <ul className="course-modal__topic-list">
                  {completed.map((topic) => (
                    <TopicRow key={topic.id} topic={topic} />
                  ))}
                </ul>
              </section>
            )}

            {upcoming.length > 0 && (
              <section className="course-modal__section">
                <h3 className="course-modal__section-title">
                  Upcoming
                  <span className="course-modal__count">{upcoming.length}</span>
                </h3>
                <ul className="course-modal__topic-list">
                  {upcoming.map((topic) => (
                    <TopicRow key={topic.id} topic={topic} />
                  ))}
                </ul>
              </section>
            )}
          </div>

          {nextTopic && (
            <footer className="course-modal__footer">
              <button type="button" className="course-modal__cta" onClick={onClose}>
                {progress != null ? `Continue — ${nextTopic.title}` : 'Start course'}
                <span aria-hidden="true"> →</span>
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
