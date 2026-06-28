export default function StarRating({ rating, reviews, size = 'sm', showCount = true }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.85;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 'full';
    if (i === full && hasHalf) return 'half';
    return 'empty';
  });

  return (
    <span
      className={`star-rating star-rating--${size}`}
      aria-label={`${rating} out of 5 stars${reviews ? `, ${reviews} reviews` : ''}`}
    >
      <span className="star-rating__stars" aria-hidden="true">
        {stars.map((type, i) => (
          <span key={i} className={`star-rating__star star-rating__star--${type}`}>
            ★
          </span>
        ))}
      </span>
      <span className="star-rating__value">{rating.toFixed(1)}</span>
      {showCount && reviews != null && (
        <span className="star-rating__count">({formatCount(reviews)})</span>
      )}
    </span>
  );
}

function formatCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return count;
}
