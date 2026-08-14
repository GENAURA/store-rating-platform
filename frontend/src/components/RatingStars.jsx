export default function Stars({
    value = 0,
    onChange,
    readOnly = false,
  }) {
    return (
      <div className="stars">
  
        {[1, 2, 3, 4, 5].map((number) => (
          <button
            key={number}
            type="button"
            disabled={readOnly}
            className={
              number <= Number(value)
                ? "star active"
                : "star"
            }
            onClick={() => {
              if (!readOnly && onChange) {
                onChange(number);
              }
            }}
          >
            ★
          </button>
        ))}
  
      </div>
    );
  }