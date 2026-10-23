import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../auth/api";
import "../styles/SignIn.css";

const byteLength = (value) => new TextEncoder().encode(value).length;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token] = useState(() => {
    const fragmentToken = new URLSearchParams(window.location.hash.slice(1)).get("token");
    const legacyQueryToken = new URLSearchParams(window.location.search).get("token");
    return fragmentToken || legacyQueryToken || "";
  });
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.hash || new URLSearchParams(window.location.search).has("token")) {
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (byteLength(password) < 12 || byteLength(password) > 72) {
      setMessage("Choose a password between 12 and 72 bytes."); return;
    }
    if (password !== confirmation) { setMessage("Your passwords do not match."); return; }
    setBusy(true); setMessage("");
    try {
      const result = await apiRequest("/api/auth/reset-password", {
        method: "POST", token: null, body: JSON.stringify({ token, password }),
      });
      navigate("/sign-in", { replace: true, state: { view: "login", message: result.message } });
    } catch (error) {
      setMessage(error instanceof TypeError ? "We couldn't reach Coveilla. Check your connection and try again." : error.message);
    } finally { setBusy(false); }
  };

  return <section className="signin-page"><div className="signin-card">
    <p className="signin-eyebrow">Coveilla Blog</p>
    <h1>Choose a new password</h1>
    <p className="signin-copy">Your password must be between 12 and 72 bytes.</p>
    {!token ? <p className="signin-status" role="alert">This reset link is invalid or has expired. Request a new link from <Link to="/sign-in">Log in</Link>.</p> : <form className="signin-form" onSubmit={submit}>
      <label htmlFor="reset-password">New password</label>
      <div className="password-input-row">
        <input id="reset-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="password-visibility" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Hide" : "Show"}</button>
      </div>
      <label htmlFor="reset-confirmation">Confirm new password</label>
      <input id="reset-confirmation" type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required />
      <button className="signin-submit" type="submit" disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
    </form>}
    {message && <p className="signin-status" role="alert">{message}</p>}
  </div></section>;
}
