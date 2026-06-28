import PlatformLogo from '../components/PlatformLogo';
import { platformColors } from '../data/learner';
import { getPlatformCourses } from '../utils/platformCourses';
import { platformHref, statusLabels } from '../utils/routes';

export default function PlatformCourses({ platform, status }) {
  const courses = getPlatformCourses(platform, status);
  const label = statusLabels[status] ?? status;

  return (
    <div className="page">
      <div className="platform-page">
        <a href="#/library" className="platform-page__back">
          ← Back to library
        </a>

        <header className="platform-page__header">
          <PlatformLogo platform={platform} size={32} />
          <div>
            <p className="eyebrow">{platform} · {label}</p>
            <h1 className="platform-page__title">
              {courses.length} {label.toLowerCase()} course
              {courses.length === 1 ? '' : 's'}
            </h1>
          </div>
        </header>

        <ul className="platform-page__list">
          {courses.map((course) => (
            <li key={course.id} className="platform-page__item">
              <img
                src={course.image}
                alt=""
                className="platform-page__thumb"
                loading="lazy"
              />
              <div className="platform-page__info">
                <span
                  className="platform-page__tag"
                  style={{ color: platformColors[platform] }}
                >
                  {platform}
                </span>
                <h2 className="platform-page__course">{course.title}</h2>
                {'progress' in course && (
                  <p className="platform-page__meta">{course.progress}% complete</p>
                )}
                {'completedDate' in course && (
                  <p className="platform-page__meta">
                    Completed {course.completedDate}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {courses.length === 0 && (
          <p className="platform-page__empty">
            No {label.toLowerCase()} courses on {platform} yet.
          </p>
        )}
      </div>
    </div>
  );
}
