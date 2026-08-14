import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Stars from "../components/Stars";

import api from "../api";
import {
  getErrorMessage,
  getRows,
  formatRating,
} from "../utils";

export default function Admin() {
  const [tab, setTab] = useState("dashboard");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [storeLoading, setStoreLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [userFilters, setUserFilters] =
    useState({
      name: "",
      email: "",
      address: "",
      role: "",
      sortBy: "name",
      sortOrder: "asc",
    });

  const [storeFilters, setStoreFilters] =
    useState({
      name: "",
      email: "",
      address: "",
      sortBy: "name",
      sortOrder: "asc",
    });

  const [userForm, setUserForm] =
    useState({
      name: "",
      email: "",
      address: "",
      password: "",
      role: "USER",
    });

  const [storeForm, setStoreForm] =
    useState({
      name: "",
      email: "",
      address: "",
      ownerId: "",
    });

  /* =========================
     DASHBOARD
  ========================= */

  async function loadDashboard() {
    try {
      const response =
        await api.get(
          "/admin/dashboard"
        );

      const data =
        response.data?.data ||
        response.data ||
        {};

      setStats({
        totalUsers:
          data.totalUsers || 0,

        totalStores:
          data.totalStores || 0,

        totalRatings:
          data.totalRatings || 0,
      });

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load dashboard."
        )
      );
    }
  }

  /* =========================
     USERS
  ========================= */

  async function loadUsers(
    filters = userFilters
  ) {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/admin/users",
          {
            params: filters,
          }
        );

      setUsers(
        getRows(response.data)
      );

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load users."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     STORES
  ========================= */

  async function loadStores(
    filters = storeFilters
  ) {
    try {
      setStoreLoading(true);
      setError("");

      const response =
        await api.get(
          "/admin/stores",
          {
            params: filters,
          }
        );

      setStores(
        getRows(response.data)
      );

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load stores."
        )
      );
    } finally {
      setStoreLoading(false);
    }
  }

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadDashboard();
    loadUsers();
    loadStores();
  }, []);

  /* =========================
     CREATE USER
  ========================= */

  async function handleCreateUser(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      await api.post(
        "/admin/users",
        userForm
      );

      setMessage(
        `${
          userForm.role === "ADMIN"
            ? "Administrator"
            : userForm.role === "STORE_OWNER"
            ? "Store Owner"
            : "Normal User"
        } created successfully.`
      );

      setUserForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
      });

      await Promise.all([
        loadDashboard(),
        loadUsers(),
      ]);

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to create user."
        )
      );
    }
  }

  /* =========================
     CREATE STORE
  ========================= */

  async function handleCreateStore(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      await api.post(
        "/admin/stores",
        {
          name: storeForm.name,
          email: storeForm.email,
          address: storeForm.address,
          ownerId:
            storeForm.ownerId || undefined,
        }
      );

      setMessage(
        "Store created successfully."
      );

      setStoreForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });

      await Promise.all([
        loadDashboard(),
        loadStores(),
      ]);

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to create store."
        )
      );
    }
  }

  /* =========================
     USER DETAILS
  ========================= */

  async function viewUser(id) {
    try {
      setError("");

      const response =
        await api.get(
          `/admin/users/${id}`
        );

      setSelectedUser(
        response.data?.data ||
          response.data
      );

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load user details."
        )
      );
    }
  }

  /* =========================
     FILTERS
  ========================= */

  function updateUserFilter(
    field,
    value
  ) {
    setUserFilters({
      ...userFilters,
      [field]: value,
    });
  }

  function updateStoreFilter(
    field,
    value
  ) {
    setStoreFilters({
      ...storeFilters,
      [field]: value,
    });
  }

  function clearUserFilters() {
    const filters = {
      name: "",
      email: "",
      address: "",
      role: "",
      sortBy: "name",
      sortOrder: "asc",
    };

    setUserFilters(filters);
    loadUsers(filters);
  }

  function clearStoreFilters() {
    const filters = {
      name: "",
      email: "",
      address: "",
      sortBy: "name",
      sortOrder: "asc",
    };

    setStoreFilters(filters);
    loadStores(filters);
  }

  return (
    <>
      <Navbar />

      <main className="page">

        {/* HEADER */}

        <div className="page-heading">

          <small>
            SYSTEM ADMINISTRATOR
          </small>

          <h1>
            Admin Control Center
          </h1>

          <p>
            Manage users, stores and platform
            activity from one place.
          </p>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* STATISTICS */}

        <div className="stats-grid">

          <div className="stat-card admin-stat">

            <div className="stat-icon">
              👥
            </div>

            <span>
              Total Users
            </span>

            <strong>
              {stats.totalUsers}
            </strong>

          </div>

          <div className="stat-card admin-stat">

            <div className="stat-icon">
              🏪
            </div>

            <span>
              Total Stores
            </span>

            <strong>
              {stats.totalStores}
            </strong>

          </div>

          <div className="stat-card admin-stat">

            <div className="stat-icon">
              ⭐
            </div>

            <span>
              Total Ratings
            </span>

            <strong>
              {stats.totalRatings}
            </strong>

          </div>

        </div>

        {/* TABS */}

        <div className="admin-tabs">

          <button
            className={
              tab === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className={
              tab === "users"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("users")
            }
          >
            Users
          </button>

          <button
            className={
              tab === "add-user"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("add-user")
            }
          >
            + Add User
          </button>

          <button
            className={
              tab === "stores"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("stores")
            }
          >
            Stores
          </button>

          <button
            className={
              tab === "add-store"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("add-store")
            }
          >
            + Add Store
          </button>

        </div>

        {/* =========================
            DASHBOARD
        ========================= */}

        {tab === "dashboard" && (

          <div className="admin-dashboard-grid">

            <section className="content-card">

              <div className="section-header">

                <div>
                  <h2>
                    Platform Overview
                  </h2>

                  <p>
                    Current system statistics.
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => {
                    loadDashboard();
                    loadUsers();
                    loadStores();
                  }}
                >
                  ↻ Refresh
                </button>

              </div>

              <div className="overview-boxes">

                <div>
                  <span>
                    Registered Users
                  </span>

                  <strong>
                    {stats.totalUsers}
                  </strong>
                </div>

                <div>
                  <span>
                    Registered Stores
                  </span>

                  <strong>
                    {stats.totalStores}
                  </strong>
                </div>

                <div>
                  <span>
                    Submitted Ratings
                  </span>

                  <strong>
                    {stats.totalRatings}
                  </strong>
                </div>

              </div>

            </section>

            <section className="content-card">

              <div className="section-header">

                <div>
                  <h2>
                    Quick Actions
                  </h2>

                  <p>
                    Common administrative tasks.
                  </p>
                </div>

              </div>

              <div className="quick-actions">

                <button
                  onClick={() =>
                    setTab("add-user")
                  }
                >
                  <span>👤</span>
                  Add Normal User
                </button>

                <button
                  onClick={() => {
                    setUserForm({
                      ...userForm,
                      role: "ADMIN",
                    });

                    setTab("add-user");
                  }}
                >
                  <span>🛡️</span>
                  Add Administrator
                </button>

                <button
                  onClick={() =>
                    setTab("add-store")
                  }
                >
                  <span>🏪</span>
                  Add Store
                </button>

              </div>

            </section>

          </div>

        )}

        {/* =========================
            USERS
        ========================= */}

        {tab === "users" && (

          <section className="content-card">

            <div className="section-header">

              <div>
                <h2>
                  Users
                </h2>

                <p>
                  Search, filter and sort
                  registered users.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={() =>
                  loadUsers()
                }
              >
                ↻ Refresh
              </button>

            </div>

            <div className="admin-filter-grid">

              <input
                placeholder="Search by name"
                value={
                  userFilters.name
                }
                onChange={(e) =>
                  updateUserFilter(
                    "name",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Search by email"
                value={
                  userFilters.email
                }
                onChange={(e) =>
                  updateUserFilter(
                    "email",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Search by address"
                value={
                  userFilters.address
                }
                onChange={(e) =>
                  updateUserFilter(
                    "address",
                    e.target.value
                  )
                }
              />

              <select
                value={
                  userFilters.role
                }
                onChange={(e) =>
                  updateUserFilter(
                    "role",
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Roles
                </option>

                <option value="USER">
                  Normal User
                </option>

                <option value="ADMIN">
                  Administrator
                </option>

                <option value="STORE_OWNER">
                  Store Owner
                </option>

              </select>

              <select
                value={
                  userFilters.sortBy
                }
                onChange={(e) =>
                  updateUserFilter(
                    "sortBy",
                    e.target.value
                  )
                }
              >

                <option value="name">
                  Sort by Name
                </option>

                <option value="email">
                  Sort by Email
                </option>

                <option value="address">
                  Sort by Address
                </option>

                <option value="role">
                  Sort by Role
                </option>

              </select>

              <select
                value={
                  userFilters.sortOrder
                }
                onChange={(e) =>
                  updateUserFilter(
                    "sortOrder",
                    e.target.value
                  )
                }
              >

                <option value="asc">
                  Ascending ↑
                </option>

                <option value="desc">
                  Descending ↓
                </option>

              </select>

            </div>

            <div className="filter-buttons">

              <button
                className="primary-button"
                onClick={() =>
                  loadUsers()
                }
              >
                Apply Filters
              </button>

              <button
                className="secondary-button"
                onClick={
                  clearUserFilters
                }
              >
                Clear
              </button>

            </div>

            {loading ? (

              <div className="loading">
                Loading users...
              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Role</th>
                      <th>Rating</th>
                      <th>Details</th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.length === 0 ? (

                      <tr>

                        <td
                          colSpan="6"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "40px",
                          }}
                        >
                          No users found.
                        </td>

                      </tr>

                    ) : (

                      users.map(
                        (user) => (

                          <tr
                            key={user.id}
                          >

                            <td>

                              <div className="user-table-name">

                                <div className="avatar">

                                  {(
                                    user.name ||
                                    "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <strong>
                                  {user.name}
                                </strong>

                              </div>

                            </td>

                            <td>
                              {user.email}
                            </td>

                            <td>
                              {user.address}
                            </td>

                            <td>

                              <span
                                className={
                                  `role role-${String(
                                    user.role
                                  ).toLowerCase()}`
                                }
                              >
                                {user.role}
                              </span>

                            </td>

                            <td>

                              {user.role ===
                              "STORE_OWNER" ? (

                                <div className="rating-cell">

                                  <Stars
                                    value={
                                      user.rating
                                    }
                                    readOnly
                                  />

                                  <span>
                                    {formatRating(
                                      user.rating
                                    )}
                                  </span>

                                </div>

                              ) : (
                                "—"
                              )}

                            </td>

                            <td>

                              <button
                                className="view-button"
                                onClick={() =>
                                  viewUser(
                                    user.id
                                  )
                                }
                              >
                                View
                              </button>

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

        {/* =========================
            ADD USER
        ========================= */}

        {tab === "add-user" && (

          <section className="content-card add-user-card">

            <div className="section-header">

              <div>

                <h2>
                  Add New User
                </h2>

                <p>
                  Create a normal user,
                  administrator or store owner.
                </p>

              </div>

            </div>

            <form
              className="admin-form"
              onSubmit={
                handleCreateUser
              }
            >

              <label>
                Name

                <input
                  value={
                    userForm.name
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name:
                        e.target.value,
                    })
                  }
                  minLength={20}
                  maxLength={60}
                  required
                  placeholder="Minimum 20 characters"
                />

                <small>
                  {userForm.name.length}/60
                </small>
              </label>

              <label>
                Email

                <input
                  type="email"
                  value={
                    userForm.email
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      email:
                        e.target.value,
                    })
                  }
                  required
                  placeholder="user@example.com"
                />
              </label>

              <label>
                Address

                <textarea
                  value={
                    userForm.address
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      address:
                        e.target.value,
                    })
                  }
                  maxLength={400}
                  required
                  placeholder="User address"
                />

                <small>
                  {userForm.address.length}/400
                </small>
              </label>

              <label>
                Password

                <input
                  type="password"
                  value={
                    userForm.password
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      password:
                        e.target.value,
                    })
                  }
                  minLength={8}
                  maxLength={16}
                  required
                  placeholder="8–16 characters"
                />
              </label>

              <label>
                Role

                <select
                  value={
                    userForm.role
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      role:
                        e.target.value,
                    })
                  }
                >

                  <option value="USER">
                    Normal User
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>

                  <option value="STORE_OWNER">
                    Store Owner
                  </option>

                </select>

              </label>

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create User
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setTab("users")
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

        )}

        {/* =========================
            STORES
        ========================= */}

        {tab === "stores" && (

          <section className="content-card">

            <div className="section-header">

              <div>

                <h2>
                  Store Management
                </h2>

                <p>
                  View, search, filter and
                  sort registered stores.
                </p>

              </div>

              <button
                className="secondary-button"
                onClick={() =>
                  loadStores()
                }
              >
                ↻ Refresh
              </button>

            </div>

            <div className="admin-filter-grid">

              <input
                placeholder="Search by store name"
                value={
                  storeFilters.name
                }
                onChange={(e) =>
                  updateStoreFilter(
                    "name",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Search by email"
                value={
                  storeFilters.email
                }
                onChange={(e) =>
                  updateStoreFilter(
                    "email",
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Search by address"
                value={
                  storeFilters.address
                }
                onChange={(e) =>
                  updateStoreFilter(
                    "address",
                    e.target.value
                  )
                }
              />

              <select
                value={
                  storeFilters.sortBy
                }
                onChange={(e) =>
                  updateStoreFilter(
                    "sortBy",
                    e.target.value
                  )
                }
              >

                <option value="name">
                  Sort by Name
                </option>

                <option value="email">
                  Sort by Email
                </option>

                <option value="address">
                  Sort by Address
                </option>

                <option value="rating">
                  Sort by Rating
                </option>

              </select>

              <select
                value={
                  storeFilters.sortOrder
                }
                onChange={(e) =>
                  updateStoreFilter(
                    "sortOrder",
                    e.target.value
                  )
                }
              >

                <option value="asc">
                  Ascending ↑
                </option>

                <option value="desc">
                  Descending ↓
                </option>

              </select>

            </div>

            <div className="filter-buttons">

              <button
                className="primary-button"
                onClick={() =>
                  loadStores()
                }
              >
                Apply Filters
              </button>

              <button
                className="secondary-button"
                onClick={
                  clearStoreFilters
                }
              >
                Clear
              </button>

            </div>

            {storeLoading ? (

              <div className="loading">
                Loading stores...
              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Name
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

                    </tr>

                  </thead>

                  <tbody>

                    {stores.length === 0 ? (

                      <tr>

                        <td
                          colSpan="4"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "40px",
                          }}
                        >
                          No stores found.
                        </td>

                      </tr>

                    ) : (

                      stores.map(
                        (store) => (

                          <tr
                            key={store.id}
                          >

                            <td>

                              <strong>
                                {store.name}
                              </strong>

                            </td>

                            <td>
                              {store.email}
                            </td>

                            <td>
                              {store.address}
                            </td>

                            <td>

                              <div className="rating-cell">

                                <Stars
                                  value={
                                    store.rating
                                  }
                                  readOnly
                                />

                                <span>
                                  {formatRating(
                                    store.rating
                                  )}
                                </span>

                              </div>

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

        {/* =========================
            ADD STORE
        ========================= */}

        {tab === "add-store" && (

          <section className="content-card">

            <div className="section-header">

              <div>

                <h2>
                  Add New Store
                </h2>

                <p>
                  Register a new store on
                  the platform.
                </p>

              </div>

            </div>

            <form
              className="admin-form"
              onSubmit={
                handleCreateStore
              }
            >

              <label>
                Store Name

                <input
                  value={
                    storeForm.name
                  }
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      name:
                        e.target.value,
                    })
                  }
                  required
                  placeholder="Enter store name"
                />

              </label>

              <label>
                Store Email

                <input
                  type="email"
                  value={
                    storeForm.email
                  }
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      email:
                        e.target.value,
                    })
                  }
                  required
                  placeholder="store@example.com"
                />

              </label>

              <label>
                Address

                <textarea
                  value={
                    storeForm.address
                  }
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      address:
                        e.target.value,
                    })
                  }
                  maxLength={400}
                  required
                  placeholder="Store address"
                />

                <small>
                  {storeForm.address.length}/400
                </small>

              </label>

              <label>
                Store Owner ID
                <span
                  style={{
                    fontWeight: 400,
                    color: "#94a3b8",
                  }}
                >
                  Optional. Leave empty if
                  the store has no owner yet.
                </span>

                <input
                  value={
                    storeForm.ownerId
                  }
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      ownerId:
                        e.target.value,
                    })
                  }
                  placeholder="UUID of STORE_OWNER"
                />

              </label>

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Store
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setTab("stores")
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

        )}

      </main>

      {/* USER DETAILS MODAL */}

      {selectedUser && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="user-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-btn"
              onClick={() =>
                setSelectedUser(null)
              }
            >
              ×
            </button>

            <div className="modal-user-avatar">

              {(
                selectedUser.name ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}

            </div>

            <h2>
              {selectedUser.name}
            </h2>

            <span className="role">
              {selectedUser.role}
            </span>

            <div className="user-detail-list">

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {selectedUser.email}
                </strong>

              </div>

              <div>

                <span>
                  Address
                </span>

                <strong>
                  {selectedUser.address}
                </strong>

              </div>

              {selectedUser.role ===
                "STORE_OWNER" && (

                <div>

                  <span>
                    Store Rating
                  </span>

                  <strong>
                    ★{" "}
                    {formatRating(
                      selectedUser.rating
                    )}
                  </strong>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </>
  );
}
