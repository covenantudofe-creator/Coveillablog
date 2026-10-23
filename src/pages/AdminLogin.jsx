import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const { user, signInAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user?.role === "admin") return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInAdmin(username, password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in. Check your credentials and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="admin-login-icon" aria-hidden="true">🔐</span>
        <p className="admin-login-kicker">COVEILLA ADMIN</p>
        <h1>Admin sign in</h1>
        <p>Use your administrator username and password to manage the blog.</p>
        <label>Username<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </section>
  );
}
