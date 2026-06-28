export const learnerRankDefaults = {
  percentile: 2,
  label: 'top 2%',
};

export function getLearnerRank(overallProgress, streakCurrent) {
  if (overallProgress >= 70 && streakCurrent >= 4) {
    return { percentile: 2, label: 'top 2%' };
  }
  if (overallProgress >= 55 && streakCurrent >= 2) {
    return { percentile: 8, label: 'top 8%' };
  }
  return { percentile: 15, label: 'top 15%' };
}

const ACTIVITY_BASE = {
  focusingNow: 847,
  completedLast3h: 2341,
};

export function getLiveActivity() {
  const now = new Date();
  const hour = now.getHours();
  const peak = hour >= 8 && hour <= 22;
  const modifier = peak ? 1.12 : 0.78;
  const jitter = (now.getMinutes() % 13) + now.getSeconds() % 7;

  return {
    focusingNow: Math.round((ACTIVITY_BASE.focusingNow + jitter * 4) * modifier),
    completedLast3h: Math.round(
      (ACTIVITY_BASE.completedLast3h + jitter * 18) * modifier
    ),
  };
}

export const byteRatings = {
  'byte-1': { rating: 4.9, reviews: 1842 },
  'byte-2': { rating: 4.8, reviews: 3105 },
  'byte-3': { rating: 4.7, reviews: 956 },
  'byte-4': { rating: 4.8, reviews: 721 },
  'byte-5': { rating: 4.9, reviews: 1433 },
  'byte-6': { rating: 4.6, reviews: 608 },
  'byte-7': { rating: 4.7, reviews: 892 },
  'byte-8': { rating: 4.9, reviews: 2104 },
  'byte-9': { rating: 4.8, reviews: 1177 },
  'byte-10': { rating: 4.7, reviews: 1650 },
  'byte-11': { rating: 4.6, reviews: 534 },
  'byte-12': { rating: 4.8, reviews: 889 },
};

export const courseRatings = {
  'ip-1': { rating: 4.8, reviews: 12400 },
  'ip-2': { rating: 4.7, reviews: 48200 },
  'ip-3': { rating: 4.9, reviews: 8900 },
  'rec-1': { rating: 4.8, reviews: 3200 },
  'rec-2': { rating: 4.6, reviews: 18700 },
  'rec-3': { rating: 4.9, reviews: 9100 },
  'done-1': { rating: 4.7, reviews: 22100 },
  'done-2': { rating: 4.8, reviews: 35600 },
  'done-3': { rating: 4.9, reviews: 7800 },
  'done-4': { rating: 4.5, reviews: 45200 },
};

export function getByteRating(byteId) {
  return byteRatings[byteId] ?? { rating: 4.7, reviews: 500 };
}

export function getCourseRating(courseId) {
  return courseRatings[courseId] ?? { rating: 4.6, reviews: 1200 };
}

export function formatReviewCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return count.toString();
}
