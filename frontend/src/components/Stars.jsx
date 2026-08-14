export default function Stars({
  value = 0,
  onChange,
  readOnly = false,
}) {
  const rating = Number(value) || 0;

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={
            star <= rating
              ? "star active"
              : "star"
          }
          onClick={() => {
            if (!readOnly && onChange) {
              onChange(star);
            }
          }}
          aria-label={`Rate ${star} out of 5`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
