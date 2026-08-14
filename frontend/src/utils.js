export function getErrorMessage(
    error,
    fallback = "Something went wrong"
  ) {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    );
  }
  
  export function getRows(data) {
    if (Array.isArray(data)) {
      return data;
    }
  
    return (
      data?.data ||
      data?.users ||
      data?.stores ||
      data?.ratings ||
      []
    );
  }
  
  export function formatRating(value) {
    const number = Number(value || 0);
  
    return Number.isFinite(number)
      ? number.toFixed(1)
      : "0.0";
  }