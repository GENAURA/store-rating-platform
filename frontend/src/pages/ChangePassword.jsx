import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import { getErrorMessage } from "../utils";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!passwordRegex.test(form.newPassword)) {
      setError(
        "New password must be 8-16 characters with uppercase and special character."
      );

      return;
    }

    try {
      const response = await api.put(
        "/auth/password",
        form
      );

      setMessage(
        response.data?.message ||
          "Password updated successfully."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
      });

    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update password."
        )
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="page narrow">

        <div className="page-heading">
          <small>ACCOUNT SECURITY</small>
          <h1>Change password</h1>
          <p>
            Update your password securely.
          </p>
        </div>

        <form
          className="content-card form-card"
          onSubmit={handleSubmit}
        >

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <label>
            Current password

            <input
              type="password"
              required
              value={
                form.currentPassword
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  currentPassword:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            New password

            <input
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={
                form.newPassword
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  newPassword:
                    event.target.value,
                })
              }
            />
          </label>

          <button className="primary-button">
            Update Password
          </button>

        </form>

      </main>
    </>
  );
}