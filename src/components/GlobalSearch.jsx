import { useEffect, useState } from 'react';
import { parseRoute, searchHref } from '../utils/routes';

export default function GlobalSearch({ initialQuery = '' }) {
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  const submit = (e) => {
    e.preventDefault();
    window.location.hash = searchHref(value.trim());
  };

  return (
    <form className="global-search" onSubmit={submit} role="search">
      <span className="global-search__icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.75" />
          <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="search"
        className="global-search__input"
        placeholder="Search courses, topics, platforms…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search courses, topics, and platforms"
      />
    </form>
  );
}

export function useRouteQuery() {
  const route = parseRoute(window.location.hash);
  return route.name === 'search' ? route.query : '';
}
