import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Stars from "../components/Stars";

import api from "../api";
import {
  getErrorMessage,
  getRows,
  formatRating,
} from "../utils";

export default function Owner() {
  const [data, setData] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {

    api
      .get("/owner/dashboard")
      .then((response) => {

        setData(
          response.data?.data ||
          response.data
        );

      })
      .catch((error) => {

        setError(
          getErrorMessage(
            error,
            "Unable to load owner dashboard."
          )
        );

      });

  }, []);

  if (error) {
    return (
      <>
        <Navbar />

        <main className="page">

          <div className="error-message">
            {error}
          </div>

        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />

        <main className="page loading">
          Loading dashboard...
        </main>
      </>
    );
  }

  const store =
    data.store || data;

  const ratings =
    getRows(
      data.ratings ||
      data.reviews ||
      data.submissions ||
      []
    );

  const average =
    store.averageRating ??
    store.rating ??
    0;

  return (
    <>
      <Navbar />

      <main className="page">

        <section className="owner-header">

          <div>

            <small>
              STORE OWNER PORTAL
            </small>

            <h1>
              {store.name ||
                "My Store"}
            </h1>

            <p>
              ⌖ {store.address}
            </p>

          </div>

          <div className="owner-rating">

            <strong>
              ★ {formatRating(average)}
            </strong>

            <span>
              Average customer rating
            </span>

          </div>

        </section>

        <div className="stats-grid">

          <div className="stat-card">

            <span>
              Average rating
            </span>

            <strong>
              ★ {formatRating(average)}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Total ratings
            </span>

            <strong>
              {store.totalRatings ??
                ratings.length}
            </strong>

          </div>

        </div>

        <section className="content-card">

          <h2>
            Customer feedback
          </h2>

          <p className="muted">
            Users who submitted ratings
            for your store.
          </p>

          {ratings.length === 0 ? (

            <div className="empty">
              No ratings have been
              submitted yet.
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Rating</th>
                  </tr>

                </thead>

                <tbody>

                  {ratings.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          index
                        }
                      >

                        <td>
                          {item.name ||
                            item.userName}
                        </td>

                        <td>
                          {item.email ||
                            item.userEmail}
                        </td>

                        <td>
                          {item.address ||
                            "—"}
                        </td>

                        <td>

                          <Stars
                            value={
                              item.rating
                            }
                            readOnly
                          />

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>
    </>
  );
}