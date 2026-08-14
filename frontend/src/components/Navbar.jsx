import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <div
          className="brand"
          onClick={() => navigate("/")}
        >
          <span className="brand-icon">★</span>
          StoreRate
        </div>

        <nav className="nav-links">

          {user?.role === "ADMIN" && (
            <NavLink to="/admin">
              Dashboard
            </NavLink>
          )}

          {user?.role === "USER" && (
            <NavLink to="/stores">
              Stores
            </NavLink>
          )}

          {user?.role === "STORE_OWNER" && (
            <NavLink to="/owner">
              My Store
            </NavLink>
          )}

          <NavLink to="/change-password">
            Password
          </NavLink>

        </nav>

        <div className="nav-user">

          <div className="avatar">
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}