import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import api from "../api";
import {
  getErrorMessage,
  getRows,
  formatRating,
} from "../utils";

const emptyUser = {
  name: "",
  email: "",
  password: "",
  address: "",
  role: "USER",
};

const emptyStore = {
  name: "",
  email: "",
  address: "",
  ownerId: "",
};

export default function Admin() {
  const [tab, setTab] =
    useState("overview");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] =
    useState([]);

  const [stores, setStores] =
    useState([]);

  const [owners, setOwners] =
    useState([]);

  const [error, setError] =
    useState("");

  const [userForm, setUserForm] =
    useState(emptyUser);

  const [storeForm, setStoreForm] =
    useState(emptyStore);

  const [userFilter, setUserFilter] =
    useState({
      name: "",
      email: "",
      address: "",
      role: "",
    });

  const [storeFilter, setStoreFilter] =
    useState({
      name: "",
      email: "",
      address: "",
    });

  const loadData = async () => {
    try {
      setError("");

      const [
        dashboardResponse,
        usersResponse,
        storesResponse,
        ownersResponse,
      ] = await Promise.all([
        api.get("/admin/dashboard"),

        api.get("/admin/users", {
          params: userFilter,
        }),

        api.get("/admin/stores", {
          params: storeFilter,
        }),

        api.get("/admin/users", {
          params: {
            role: "STORE_OWNER",
          },
        }),
      ]);

      const dashboard =
        dashboardResponse.data?.data ||
        dashboardResponse.data;

      setStats({
        totalUsers:
          dashboard.totalUsers ??
          dashboard.usersCount ??
          0,

        totalStores:
          dashboard.totalStores ??
          dashboard.storesCount ??
          0,

        totalRatings:
          dashboard.totalRatings ??
          dashboard.ratingsCount ??
          0,
      });

      setUsers(
        getRows(usersResponse.data)
      );

      setStores(
        getRows(storesResponse.data)
      );

      setOwners(
        getRows(ownersResponse.data)
      );

    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to load admin data."
        )
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createUser = async (
    event
  ) => {
    event.preventDefault();

    try {
      await api.post(
        "/admin/users",
        userForm
      );

      setUserForm(emptyUser);

      await loadData();

      setTab("users");

    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create user."
        )
      );
    }
  };

  const createStore = async (
    event
  ) => {
    event.preventDefault();

    try {
      await api.post(
        "/admin/stores",
        storeForm
      );

      setStoreForm(emptyStore);

      await loadData();

      setTab("stores");

    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create store."
        )
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="page">

        <div className="page-heading">

          <small>
            SYSTEM ADMINISTRATOR
          </small>

          <h1>
            Control center
          </h1>

          <p>
            Manage users, stores and
            platform activity.
          </p>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Statistics */}

        <div className="stats-grid">

          <div className="stat-card">
            <span>
              Total users
            </span>

            <strong>
              {stats.totalUsers}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Registered stores
            </span>

            <strong>
              {stats.totalStores}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Submitted ratings
            </span>

            <strong>
              {stats.totalRatings}
            </strong>
          </div>

        </div>

        {/* Tabs */}

        <div className="tabs">

          <button
            className={
              tab === "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("overview")
            }
          >
            Overview
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

        {/* Overview */}

        {tab === "overview" && (

          <div className="two-columns">

            <section className="content-card">

              <h2>
                Platform users
              </h2>

              {users
                .slice(0, 6)
                .map((user) => (

                  <div
                    className="list-row"
                    key={user.id}
                  >

                    <div className="avatar">
                      {(user.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="list-info">
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>

                    <em>
                      {user.role}
                    </em>

                  </div>

                ))}

            </section>

            <section className="content-card">

              <h2>
                Registered stores
              </h2>

              {stores
                .slice(0, 6)
                .map((store) => (

                  <div
                    className="list-row"
                    key={store.id}
                  >

                    <div className="avatar orange">
                      {(store.name || "S")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="list-info">
                      <strong>
                        {store.name}
                      </strong>

                      <span>
                        {store.address}
                      </span>
                    </div>

                    <em>
                      ★{" "}
                      {formatRating(
                        store.rating ??
                        store.overallRating
                      )}
                    </em>

                  </div>

                ))}

            </section>

          </div>
        )}

        {/* Users */}

        {tab === "users" && (

          <section className="content-card">

            <h2>
              Users
            </h2>

            <div className="filter-grid">

              <input
                placeholder="Name"
                value={userFilter.name}
                onChange={(event) =>
                  setUserFilter({
                    ...userFilter,
                    name:
                      event.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                value={userFilter.email}
                onChange={(event) =>
                  setUserFilter({
                    ...userFilter,
                    email:
                      event.target.value,
                  })
                }
              />

              <input
                placeholder="Address"
                value={userFilter.address}
                onChange={(event) =>
                  setUserFilter({
                    ...userFilter,
                    address:
                      event.target.value,
                  })
                }
              />

              <select
                value={userFilter.role}
                onChange={(event) =>
                  setUserFilter({
                    ...userFilter,
                    role:
                      event.target.value,
                  })
                }
              >
                <option value="">
                  All roles
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

              <button
                className="primary-button"
                onClick={loadData}
              >
                Apply Filters
              </button>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Role</th>
                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td>
                        <strong>
                          {user.name}
                        </strong>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.address}
                      </td>

                      <td>
                        <span className="role">
                          {user.role}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* Stores */}

        {tab === "stores" && (

          <section className="content-card">

            <h2>
              Stores
            </h2>

            <div className="filter-grid">

              <input
                placeholder="Store name"
                value={storeFilter.name}
                onChange={(event) =>
                  setStoreFilter({
                    ...storeFilter,
                    name:
                      event.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                value={storeFilter.email}
                onChange={(event) =>
                  setStoreFilter({
                    ...storeFilter,
                    email:
                      event.target.value,
                  })
                }
              />

              <input
                placeholder="Address"
                value={storeFilter.address}
                onChange={(event) =>
                  setStoreFilter({
                    ...storeFilter,
                    address:
                      event.target.value,
                  })
                }
              />

              <button
                className="primary-button"
                onClick={loadData}
              >
                Apply Filters
              </button>

            </div>

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

                  {stores.map((store) => (

                    <tr key={store.id}>

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
                        ★{" "}
                        {formatRating(
                          store.rating ??
                          store.overallRating
                        )}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* Add user */}

        {tab === "add-user" && (

          <section className="content-card form-card">

            <h2>
              Add new user
            </h2>

            <form
              onSubmit={createUser}
              className="form-grid"
            >

              <label>
                Name

                <input
                  required
                  minLength={20}
                  maxLength={60}
                  value={userForm.name}
                  onChange={(event) =>
                    setUserForm({
                      ...userForm,
                      name:
                        event.target.value,
                    })
                  }
                />

              </label>

              <label>
                Email

                <input
                  required
                  type="email"
                  value={userForm.email}
                  onChange={(event) =>
                    setUserForm({
                      ...userForm,
                      email:
                        event.target.value,
                    })
                  }
                />

              </label>

              <label>
                Address

                <textarea
                  required
                  maxLength={400}
                  value={userForm.address}
                  onChange={(event) =>
                    setUserForm({
                      ...userForm,
                      address:
                        event.target.value,
                    })
                  }
                />

              </label>

              <label>
                Password

                <input
                  required
                  type="password"
                  minLength={8}
                  maxLength={16}
                  value={
                    userForm.password
                  }
                  onChange={(event) =>
                    setUserForm({
                      ...userForm,
                      password:
                        event.target.value,
                    })
                  }
                />

              </label>

              <label>
                Role

                <select
                  value={userForm.role}
                  onChange={(event) =>
                    setUserForm({
                      ...userForm,
                      role:
                        event.target.value,
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

              <button className="primary-button">
                Create User
              </button>

            </form>

          </section>
        )}

        {/* Add store */}

        {tab === "add-store" && (

          <section className="content-card form-card">

            <h2>
              Add new store
            </h2>

            <form
              onSubmit={createStore}
              className="form-grid"
            >

              <label>
                Store name

                <input
                  required
                  value={storeForm.name}
                  onChange={(event) =>
                    setStoreForm({
                      ...storeForm,
                      name:
                        event.target.value,
                    })
                  }
                />

              </label>

              <label>
                Email

                <input
                  required
                  type="email"
                  value={storeForm.email}
                  onChange={(event) =>
                    setStoreForm({
                      ...storeForm,
                      email:
                        event.target.value,
                    })
                  }
                />

              </label>

              <label>
                Address

                <textarea
                  required
                  maxLength={400}
                  value={storeForm.address}
                  onChange={(event) =>
                    setStoreForm({
                      ...storeForm,
                      address:
                        event.target.value,
                    })
                  }
                />

              </label>

              <label>
                Store owner

                <select
                  value={storeForm.ownerId}
                  onChange={(event) =>
                    setStoreForm({
                      ...storeForm,
                      ownerId:
                        event.target.value,
                    })
                  }
                >

                  <option value="">
                    Select owner
                  </option>

                  {owners.map((owner) => (

                    <option
                      key={owner.id}
                      value={owner.id}
                    >
                      {owner.name} —{" "}
                      {owner.email}
                    </option>

                  ))}

                </select>

              </label>

              <button className="primary-button">
                Create Store
              </button>

            </form>

          </section>
        )}

      </main>
    </>
  );
}