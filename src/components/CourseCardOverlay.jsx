import { useEffect, useRef, useState } from 'react';
import { useCourseActions } from '../hooks/useCourseActions';

function BookmarkIcon({ filled }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M4 2.5h8a1 1 0 0 1 1 1v10.2a.5.5 0 0 1-.78.41L8 11.5l-4.22 2.61A.5.5 0 0 1 3 13.7V3.5a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="3.5" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="8" cy="12.5" r="1.2" />
    </svg>
  );
}

export default function CourseCardOverlay({ course, onNotify }) {
  const { wishlisted, priceAlert, toggleWishlist, togglePriceAlert } =
    useCourseActions(course.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const stop = (e) => e.stopPropagation();

  const handleBookmark = (e) => {
    stop(e);
    const added = toggleWishlist();
    onNotify?.(added ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const runAction = (id) => (e) => {
    stop(e);
    setMenuOpen(false);

    switch (id) {
      case 'wishlist': {
        const added = toggleWishlist();
        onNotify?.(added ? 'Added to wishlist' : 'Removed from wishlist');
        break;
      }
      case 'similar':
        window.location.hash = `#/search?q=${encodeURIComponent(course.title.split(' ').slice(0, 2).join(' '))}`;
        onNotify?.('Showing similar courses');
        break;
      case 'complete':
        onNotify?.(`Marked “${course.title}” as complete`);
        break;
      case 'irrelevant':
        onNotify?.('We’ll show fewer courses like this');
        break;
      case 'price-alert': {
        const on = togglePriceAlert();
        onNotify?.(
          on ? 'Price drop alert enabled' : 'Price drop alert removed'
        );
        break;
      }
      default:
        break;
    }
  };

  const menuItems = [
    {
      id: 'wishlist',
      label: wishlisted ? 'Remove from wishlist' : 'Add to wishlist',
    },
    { id: 'similar', label: 'View similar courses' },
    { id: 'complete', label: 'Mark as complete' },
    { id: 'irrelevant', label: 'Not relevant' },
    {
      id: 'price-alert',
      label: priceAlert ? 'Remove price alert' : 'Notify when price drops',
    },
  ];

  return (
    <div
      ref={rootRef}
      className={`card-overlay${menuOpen ? ' card-overlay--open' : ''}`}
      onClick={stop}
    >
      <button
        type="button"
        className={`card-overlay__bookmark${wishlisted ? ' card-overlay__bookmark--on' : ''}`}
        onClick={handleBookmark}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
      >
        <BookmarkIcon filled={wishlisted} />
      </button>

      <div className="card-overlay__menu-wrap">
        <button
          type="button"
          className="card-overlay__menu-btn"
          onClick={(e) => {
            stop(e);
            setMenuOpen((v) => !v);
          }}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Course actions"
        >
          <MenuIcon />
        </button>

        {menuOpen && (
          <div className="card-overlay__menu" role="menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="card-overlay__menu-item"
                role="menuitem"
                onClick={runAction(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
