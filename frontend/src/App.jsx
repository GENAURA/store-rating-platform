import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import Stores from "./pages/Stores";
import Admin from "./pages/Admin";
import Owner from "./pages/Owner";

import ProtectedRoute from "./components/ProtectedRoute";

function HomeRedirect() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "STORE_OWNER") {
    return <Navigate to="/owner" replace />;
  }

  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<HomeRedirect />}
      />

      {/* Public */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Any logged-in user */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/change-password"
          element={<ChangePassword />}
        />
      </Route>

      {/* Normal User */}
      <Route
        element={
          <ProtectedRoute roles={["USER"]} />
        }
      >
        <Route
          path="/stores"
          element={<Stores />}
        />
      </Route>

      {/* Administrator */}
      <Route
        element={
          <ProtectedRoute roles={["ADMIN"]} />
        }
      >
        <Route
          path="/admin"
          element={<Admin />}
        />
      </Route>

      {/* Store Owner */}
      <Route
        element={
          <ProtectedRoute
            roles={["STORE_OWNER"]}
          />
        }
      >
        <Route
          path="/owner"
          element={<Owner />}
        />
      </Route>

      {/* Unknown URL */}
      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />

    </Routes>
  );
}