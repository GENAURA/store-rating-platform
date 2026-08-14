import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Stars from "../components/Stars";

import api from "../api";
import {
  getErrorMessage,
  getRows,
  formatRating,
} from "../utils";

export default function Stores() {
  const [stores, setStores] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStores = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/stores", {
        params: filters,
      });

      setStores(getRows(response.data));
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to load stores."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  /*
   * Client-side sorting.
   *
   * This keeps the existing backend search API unchanged
   * while providing ascending/descending sorting for the
   * registered store listing.
   */
  const sortedStores = useMemo(() => {
    const result = [...stores];

    result.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortBy === "rating") {
        valueA = Number(
          a.overallRating ?? a.rating ?? 0
        );

        valueB = Number(
          b.overallRating ?? b.rating ?? 0
        );
      } else if (sortBy === "address") {
        valueA = String(
          a.address || ""
        ).toLowerCase();

        valueB = String(
          b.address || ""
        ).toLowerCase();
      } else {
        valueA = String(
          a.name || ""
        ).toLowerCase();

        valueB = String(
          b.name || ""
        ).toLowerCase();
      }

      if (typeof valueA === "number") {
        return sortOrder === "asc"
          ? valueA - valueB
          : valueB - valueA;
      }

      const comparison =
        valueA.localeCompare(valueB);

      return sortOrder === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [stores, sortBy, sortOrder]);

  const submitRating = async (
    storeId,
    rating
  ) => {
    try {
      setError("");

      await api.post(
        `/stores/${storeId}/rating`,
        {
          rating,
        }
      );

      await loadStores();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to save rating."
        )
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="page">

        <div className="page-heading">
          <small>CUSTOMER PORTAL</small>

          <h1>
            Discover stores
          </h1>

          <p>
            Search registered stores and
            share your experience.
          </p>
        </div>

        {/* SEARCH */}

        <section className="content-card search-card">

          <input
            placeholder="Search store name"
            value={filters.name}
            onChange={(event) =>
              setFilters({
                ...filters,
                name: event.target.value,
              })
            }
          />

          <input
            placeholder="Search address"
            value={filters.address}
            onChange={(event) =>
              setFilters({
                ...filters,
                address:
                  event.target.value,
              })
            }
          />

          <button
            className="primary-button"
            onClick={loadStores}
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>

        </section>

        {/* SORTING */}

        <section className="content-card sort-card">

          <div className="sort-heading">
            <div>
              <small>STORE LISTING</small>
              <h3>Sort stores</h3>
            </div>

            <span className="sort-count">
              {sortedStores.length} store
              {sortedStores.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="sort-controls">

            <label>
              Sort by

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >
                <option value="name">
                  Store Name
                </option>

                <option value="address">
                  Address
                </option>

                <option value="rating">
                  Overall Rating
                </option>
              </select>
            </label>

            <button
              type="button"
              className="secondary-button sort-button"
              onClick={() =>
                setSortOrder(
                  sortOrder === "asc"
                    ? "desc"
                    : "asc"
                )
              }
            >
              {sortOrder === "asc"
                ? "↑ Ascending"
                : "↓ Descending"}
            </button>

          </div>

        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Loading stores...
          </div>
        ) : sortedStores.length === 0 ? (
          <div className="content-card empty-state">
            <h3>
              No stores found
            </h3>

            <p>
              Try changing your search
              filters.
            </p>
          </div>
        ) : (
          <div className="store-grid">

            {sortedStores.map((store) => (

              <article
                className="content-card store-card"
                key={store.id}
              >

                <div className="store-top">

                  <div className="store-logo">
                    {(store.name || "S")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="overall-rating">

                    <strong>
                      ★{" "}
                      {formatRating(
                        store.overallRating ??
                        store.rating
                      )}
                    </strong>

                    <span>
                      Overall rating
                    </span>

                  </div>

                </div>

                <h2>
                  {store.name}
                </h2>

                <p className="address">
                  ⌖ {store.address}
                </p>

                <hr />

                <div className="your-rating">

                  <div>
                    <span>
                      Your submitted rating
                    </span>

                    <strong>
                      {store.userRating
                        ? `${store.userRating}/5`
                        : "Not rated yet"}
                    </strong>
                  </div>

                  <Stars
                    value={
                      store.userRating || 0
                    }
                    onChange={(value) =>
                      submitRating(
                        store.id,
                        value
                      )
                    }
                  />

                </div>

              </article>

            ))}

          </div>
        )}

      </main>
    </>
  );
}
