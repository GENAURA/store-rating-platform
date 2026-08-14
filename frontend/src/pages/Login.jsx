import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api";
import { getErrorMessage } from "../utils";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        form
      );

      const data =
        response.data?.data ||
        response.data;

      if (!data.token || !data.user) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else if (
        data.user.role === "STORE_OWNER"
      ) {
        navigate("/owner");
      } else {
        navigate("/stores");
      }

    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Invalid email or password."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="auth-brand">
          <span>★</span>
          StoreRate
        </div>

        <div className="auth-hero">

          <small>
            STORE RATING PLATFORM
          </small>

          <h1>
            Better feedback.
            <br />
            Better stores.
          </h1>

          <p>
            A single platform for customers,
            administrators and store owners
            to manage ratings and feedback.
          </p>

        </div>

      </div>

      <div className="auth-right">

        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >

          <small>WELCOME BACK</small>

          <h2>Sign in</h2>

          <p className="muted">
            Access your StoreRate account.
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <label>
            Email address

            <input
              type="email"
              required
              value={form.email}
              placeholder="you@example.com"
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
            />
          </label>

          <label>
            Password

            <input
              type="password"
              required
              value={form.password}
              placeholder="••••••••"
              onChange={(event) =>
                setForm({
                  ...form,
                  password:
                    event.target.value,
                })
              }
            />
          </label>

          <button
            className="primary-button full"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In →"}
          </button>

          <p className="auth-footer">
            New to StoreRate?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}