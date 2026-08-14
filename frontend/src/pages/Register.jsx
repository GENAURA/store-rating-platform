import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api";
import { getErrorMessage } from "../utils";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      form.name.trim().length < 20 ||
      form.name.trim().length > 60
    ) {
      setError(
        "Name must contain between 20 and 60 characters."
      );
      return;
    }

    if (form.address.length > 400) {
      setError(
        "Address cannot exceed 400 characters."
      );
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be 8-16 characters and include an uppercase letter and special character."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/register",
        form
      );

      const data =
        response.data?.data ||
        response.data;

      if (data.token && data.user) {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/stores");
      } else {
        navigate("/login");
      }

    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Registration failed."
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
            CREATE ACCOUNT
          </small>

          <h1>
            Make every
            <br />
            rating count.
          </h1>

          <p>
            Join StoreRate and share useful
            feedback about your store
            experiences.
          </p>

        </div>

      </div>

      <div className="auth-right">

        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >

          <small>NEW ACCOUNT</small>

          <h2>Create account</h2>

          <p className="muted">
            Normal users can register here.
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <label>
            Full name

            <input
              required
              minLength={20}
              maxLength={60}
              value={form.name}
              placeholder="Your full name"
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
            />
          </label>

          <label>
            Email

            <input
              type="email"
              required
              value={form.email}
              placeholder="you@example.com"
              onChange={(event) =>
                setForm({
                  ...form,
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
              value={form.address}
              placeholder="Your address"
              onChange={(event) =>
                setForm({
                  ...form,
                  address:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            Password

            <input
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={form.password}
              placeholder="Create password"
              onChange={(event) =>
                setForm({
                  ...form,
                  password:
                    event.target.value,
                })
              }
            />
          </label>

          <p className="field-help">
            8-16 characters · uppercase ·
            special character
          </p>

          <button
            className="primary-button full"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account →"}
          </button>

          <p className="auth-footer">
            Already registered?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}