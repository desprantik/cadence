import PlatformLogo from '../components/PlatformLogo';
import SocialProofStrip from '../components/SocialProofStrip';
import StarRating from '../components/StarRating';
import { formatPrice } from '../data/catalog';
import { getCourseRating } from '../data/socialProof';
import { getProgressColor } from '../utils/progressColor';
import { exampleQueries, searchCatalog, searchFilters } from '../utils/search';
import { searchHref } from '../utils/routes';

function ResultRow({ item }) {
  const { rating, reviews } = getCourseRating(item.id);

  return (
    <li>
      <article className="result-row">
        <img
          src={item.image}
          alt=""
          className="result-row__thumb"
          loading="lazy"
        />
        <div className="result-row__body">
          <div className="result-row__top">
            <h2 className="result-row__title">{item.title}</h2>
            {item.subscribed ? (
              <span className="status-pill status-pill--library">
                In your library
                {item.progress != null ? ` · ${item.progress}%` : ''}
              </span>
            ) : (
              <span className="status-pill status-pill--price">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
          <div className="result-row__meta">
            <PlatformLogo platform={item.platform} size={18} />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              {item.platform}
            </span>
            {item.validated && (
              <span className="status-pill status-pill--validated">
                Validated
              </span>
            )}
            <StarRating rating={rating} reviews={reviews} size="xs" />
            {item.progress != null && item.subscribed && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: getProgressColor(item.progress),
                }}
              >
                {item.progress}% complete
              </span>
            )}
          </div>
          {item.topics?.length > 0 && (
            <div className="result-row__topics">
              {item.topics.map((topic) => (
                <span key={topic} className="topic-pill">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </li>
  );
}

export default function SearchResults({ query = '', filter = 'all' }) {
  const results = searchCatalog(query, filter);
  const activeFilter = searchFilters.find((f) => f.id === filter) ?? searchFilters[0];

  return (
    <div className="page-content">
      <header className="page-header">
        <p className="eyebrow">Search</p>
        <h1 className="page-header__title">
          {query ? `Results for “${query}”` : 'Search courses'}
        </h1>
        <p className="page-header__sub">
          {results.length} result{results.length === 1 ? '' : 's'}
          {activeFilter.id !== 'all' ? ` in ${activeFilter.label}` : ''}
        </p>
        <SocialProofStrip compact />
      </header>

      <div className="filter-row" role="group" aria-label="Search filters">
        {searchFilters.map((f) => (
          <a
            key={f.id}
            href={searchHref(query, f.id)}
            className={`filter-chip${
              filter === f.id ? ' filter-chip--active' : ''
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {results.length > 0 ? (
        <ul className="result-list">
          {results.map((item) => (
            <ResultRow key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>
            {query
              ? `No results for “${query}”. Try a different term or filter.`
              : 'Enter a search term in the bar above to find courses.'}
          </p>
          <div className="empty-state__examples">
            {exampleQueries.map((q) => (
              <a
                key={q}
                href={searchHref(q, filter)}
                className="filter-chip"
              >
                {q}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
