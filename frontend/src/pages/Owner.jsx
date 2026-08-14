import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Stars from "../components/Stars";

import api from "../api";
import {
  getErrorMessage,
  formatRating,
} from "../utils";

export default function Owner() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/owner/dashboard"
        );

      const data =
        response.data?.data ||
        response.data;

      setStore(data.store);
      setRatings(data.ratings || []);

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load owner dashboard."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page">

          <div className="loading-page">
            <div className="loading-spinner">
              ⟳
            </div>

            <h2>
              Loading dashboard...
            </h2>

            <p>
              Getting your store rating data.
            </p>
          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page">

        {/* HEADER */}

        <div className="page-heading owner-heading">

          <small>
            STORE OWNER
          </small>

          <h1>
            Store Dashboard
          </h1>

          <p>
            Monitor your store performance
            and customer ratings.
          </p>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {store && (
          <>
            {/* STORE SUMMARY */}

            <section className="owner-store-card">

              <div className="owner-store-info">

                <div className="store-logo">
                  🏪
                </div>

                <div>

                  <small>
                    YOUR STORE
                  </small>

                  <h2>
                    {store.name}
                  </h2>

                  <p>
                    {store.address}
                  </p>

                  <span>
                    {store.email}
                  </span>

                </div>

              </div>

              <div className="owner-rating-main">

                <div className="big-rating">

                  {formatRating(
                    store.averageRating
                  )}

                </div>

                <Stars
                  value={
                    store.averageRating
                  }
                  readOnly
                />

                <span>
                  Average Rating
                </span>

              </div>

            </section>

            {/* STATISTICS */}

            <div className="stats-grid owner-stats">

              <div className="stat-card">

                <div className="stat-icon">
                  ⭐
                </div>

                <span>
                  Average Rating
                </span>

                <strong>
                  {formatRating(
                    store.averageRating
                  )}
                </strong>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  👥
                </div>

                <span>
                  Total Ratings
                </span>

                <strong>
                  {store.totalRatings}
                </strong>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  📈
                </div>

                <span>
                  Customer Feedback
                </span>

                <strong>
                  {ratings.length}
                </strong>

              </div>

            </div>

            {/* RATINGS */}

            <section className="content-card">

              <div className="section-header">

                <div>

                  <h2>
                    Customer Ratings
                  </h2>

                  <p>
                    Users who have submitted
                    ratings for your store.
                  </p>

                </div>

                <button
                  className="secondary-button"
                  onClick={
                    loadDashboard
                  }
                >
                  ↻ Refresh
                </button>

              </div>

              {ratings.length === 0 ? (

                <div className="empty-state">

                  <div>
                    ⭐
                  </div>

                  <h3>
                    No ratings yet
                  </h3>

                  <p>
                    Your customer ratings will
                    appear here once users
                    submit them.
                  </p>

                </div>

              ) : (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Customer
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Address
                        </th>

                        <th>
                          Rating
                        </th>

                        <th>
                          Last Updated
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {ratings.map(
                        (rating) => (

                          <tr
                            key={
                              `${rating.id}-${rating.updated_at}`
                            }
                          >

                            <td>

                              <div className="user-table-name">

                                <div className="avatar">

                                  {(
                                    rating.name ||
                                    "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <strong>
                                  {rating.name}
                                </strong>

                              </div>

                            </td>

                            <td>
                              {rating.email}
                            </td>

                            <td>
                              {rating.address}
                            </td>

                            <td>

                              <div className="rating-cell">

                                <Stars
                                  value={
                                    rating.rating
                                  }
                                  readOnly
                                />

                                <span>
                                  {rating.rating}/5
                                </span>

                              </div>

                            </td>

                            <td>

                              {rating.updated_at
                                ? new Date(
                                    rating.updated_at
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>
        )}

        {!store && !error && (

          <div className="empty-state">

            <div>
              🏪
            </div>

            <h3>
              No store assigned
            </h3>

            <p>
              No store has been assigned
              to your account yet.
            </p>

          </div>

        )}

      </main>
    </>
  );
}
