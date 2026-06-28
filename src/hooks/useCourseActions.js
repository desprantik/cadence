import { useCallback, useEffect, useState } from 'react';

const WISHLIST_KEY = 'cadence.wishlist';
const PRICE_ALERTS_KEY = 'cadence.priceAlerts';

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export function useCourseActions(courseId) {
  const [wishlisted, setWishlisted] = useState(() => loadSet(WISHLIST_KEY).has(courseId));
  const [priceAlert, setPriceAlert] = useState(() =>
    loadSet(PRICE_ALERTS_KEY).has(courseId)
  );

  const toggleWishlist = useCallback(() => {
    const next = !wishlisted;
    const set = loadSet(WISHLIST_KEY);
    if (next) set.add(courseId);
    else set.delete(courseId);
    saveSet(WISHLIST_KEY, set);
    setWishlisted(next);
    return next;
  }, [courseId, wishlisted]);

  const togglePriceAlert = useCallback(() => {
    const next = !priceAlert;
    const set = loadSet(PRICE_ALERTS_KEY);
    if (next) set.add(courseId);
    else set.delete(courseId);
    saveSet(PRICE_ALERTS_KEY, set);
    setPriceAlert(next);
    return next;
  }, [courseId, priceAlert]);

  return { wishlisted, priceAlert, toggleWishlist, togglePriceAlert };
}
