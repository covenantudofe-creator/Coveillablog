import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../auth/api";
import { useAuth } from "../auth/useAuth";
import "../styles/SignIn.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const passwordBytes = (value) => new TextEncoder().encode(value).length;
const GOOGLE_IDENTITY_STATE_KEY = "__coveillaGoogleIdentityState";

function getGoogleIdentityState() {
  if (!window[GOOGLE_IDENTITY_STATE_KEY]) {
    window[GOOGLE_IDENTITY_STATE_KEY] = { initializedClientId: null, credentialHandler: null };
  }
  return window[GOOGLE_IDENTITY_STATE_KEY];
}

function dispatchGoogleCredential(response) {
  window[GOOGLE_IDENTITY_STATE_KEY]?.credentialHandler?.(response);
}

function friendlyError(error, fallback) {
  if (error instanceof TypeError) return "We couldn't reach Coveilla. Check your connection and try again.";
  return error.message || fallback;
}

export default function SignIn() {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState(location.state?.view || "login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");
  const [messageKind, setMessageKind] = useState(location.state?.message ? "success" : "error");
  const [busy, setBusy] = useState(false);
  const { signInWithGoogle, signInReader, registerReader, user, loading } = useAuth();
  const returnPath = location.state?.from?.pathname;
  const isGoogleView = view === "login" || view === "signup";

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !isGoogleView || !buttonRef.current) return undefined;
    let cancelled = false;
    const credentialHandler = async ({ credential }) => {
      if (!credential || cancelled) return;
      setBusy(true);
      setMessage("");
      try {
        const session = await signInWithGoogle(credential);
        navigate(session.user.role === "admin" ? "/admin" : (returnPath || "/"), { replace: true });
      } catch (error) {
        setMessageKind("error");
        setMessage(friendlyError(error, "Google sign-in failed. Please try again."));
      } finally { setBusy(false); }
    };
    const googleIdentityState = getGoogleIdentityState();
    googleIdentityState.credentialHandler = credentialHandler;
    const initializeGoogle = () => {
      if (cancelled || !window.google?.accounts?.id) return;
      if (googleIdentityState.initializedClientId !== GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          auto_select: false,
          button_auto_select: false,
          callback: dispatchGoogleCredential,
        });
        googleIdentityState.initializedClientId = GOOGLE_CLIENT_ID;
      }
    }
    const existing = document.querySelector('script[data-google-identity]');
    const script = existing || document.createElement("script");
    const onScriptError = () => {
      if (!cancelled) setMessage("Google sign-in could not load. Check your connection and try again.");
    };
    script.addEventListener("error", onScriptError, { once: true });
    if (!existing) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      document.head.appendChild(script);
    }
    initializeGoogle();
    script.addEventListener("load", initializeGoogle);
    return () => {
      cancelled = true;
      script.removeEventListener("load", initializeGoogle);
      script.removeEventListener("error", onScriptError);
      if (googleIdentityState.credentialHandler === credentialHandler) googleIdentityState.credentialHandler = null;
    };
  }, [isGoogleView, navigate, returnPath, signInWithGoogle]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !isGoogleView || !buttonRef.current) return undefined;
    let cancelled = false;
    const renderButton = () => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard", theme: "outline", size: "large", shape: "pill",
        text: view === "signup" ? "signup_with" : "signin_with", width: 320, logo_alignment: "left",
      });
    };
    const script = document.querySelector('script[data-google-identity]');
    renderButton();
    script?.addEventListener("load", renderButton);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", renderButton);
    };
  }, [isGoogleView, view]);

  if (!loading && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : (returnPath || "/")} replace />;
  }

  const changeView = (next) => { setView(next); setMessage(""); setMessageKind("error"); };
  const submitLogin = async (event) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) { setMessage("Enter your email address and password."); return; }
    setBusy(true); setMessage("");
    try {
      const session = await signInReader(cleanEmail, password);
      setPassword("");
      navigate(session.user.role === "admin" ? "/admin" : (returnPath || "/"), { replace: true });
    } catch (error) { setMessage(friendlyError(error, "Sign-in failed. Please try again.")); }
    finally { setBusy(false); }
  };

  const submitRegistration = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) { setMessage("Enter your name and email address."); return; }
    const byteCount = passwordBytes(password);
    if (byteCount < 12 || byteCount > 72) {
      setMessage("Use a password between 12 and 72 UTF-8 bytes. Some characters use more than one byte."); return;
    }
    if (password !== confirmation) { setMessage("Your passwords do not match."); return; }
    setBusy(true); setMessage("");
    try {
      const result = await registerReader(name.trim(), email.trim(), password);
      setPassword(""); setConfirmation(""); setName(""); setShowPassword(false); setShowConfirmation(false);
      setMessageKind("success"); setMessage(result.message || "Your account was created. You can now log in.");
      setView("login");
    } catch (error) { setMessage(friendlyError(error, "Account creation failed. Please try again.")); }
    finally { setBusy(false); }
  };

  const submitRecovery = async (event) => {
    event.preventDefault();
    if (!email.trim()) { setMessage("Enter the email address associated with your account."); return; }
    setBusy(true); setMessage("");
    try {
      const result = await apiRequest("/api/auth/forgot-password", {
        method: "POST", token: null, body: JSON.stringify({ email: email.trim() }),
      });
      setMessageKind("success"); setMessage(result.message);
    } catch (error) { setMessage(friendlyError(error, "We couldn't process that request. Please try again.")); }
    finally { setBusy(false); }
  };

  return (
    <section className="signin-page">
      <div className={`signin-card ${view === "signup" ? "is-signup" : ""}`}>
        <p className="signin-eyebrow">{view === "signup" ? "COVEILLA" : "Coveilla Blog"}</p>
        {view === "login" && <>
          <p className="signin-copy">Welcome back. Sign in to continue to Coveilla.</p>
          <form className="signin-form" onSubmit={submitLogin}>
            <label htmlFor="signin-email">Email address</label>
            <input id="signin-email" name="email" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="signin-password">Password</label>
            <div className="password-input-row">
              <input id="signin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button className="password-visibility" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            <button className="signin-text-button signin-forgot-link" type="button" onClick={() => changeView("recovery")}>Forgot password?</button>
            <button className="signin-submit" type="submit" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
          </form>
          <p className="signin-login-note">Administrator access uses a separate <Link to="/admin/login">admin sign-in</Link>.</p>
        </>}

        {view === "signup" && <>
          <h1>Create your account</h1>
          <p className="signin-copy">Join Coveilla as a reader.</p>
          <form className="signin-form signup-form" onSubmit={submitRegistration}>
            <div className="signup-field">
              <label htmlFor="signup-name">Full name</label>
              <input id="signup-name" name="name" type="text" autoComplete="name" maxLength="255" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="signup-field">
              <label htmlFor="signup-email">Email address</label>
              <input id="signup-email" name="email" type="email" autoComplete="email" maxLength="320" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="signup-field">
              <label htmlFor="signup-password">Password</label>
              <div className="password-input-row">
                <input id="signup-password" name="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="password-visibility" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Hide" : "Show"}</button>
              </div>
              <small className="signup-password-help">Use 12–72 UTF-8 bytes. Some characters use more than one byte.</small>
            </div>
            <div className="signup-field">
              <label htmlFor="signup-confirmation">Confirm password</label>
              <div className="password-input-row">
                <input id="signup-confirmation" name="confirm-password" type={showConfirmation ? "text" : "password"} autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required />
                <button className="password-visibility" type="button" aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirmation} onClick={() => setShowConfirmation((v) => !v)}>{showConfirmation ? "Hide" : "Show"}</button>
              </div>
            </div>
            <button className="signin-submit" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
          </form>
          {message && <p className={`signin-status ${messageKind === "success" ? "is-success" : ""}`} role={messageKind === "error" ? "alert" : "status"}>{message}</p>}
        </>}

        {view === "recovery" && <>
          <h1>Reset your password</h1>
          <p className="signin-copy">Enter your account email and we’ll send a secure reset link if it can be recovered.</p>
          <form className="signin-form" onSubmit={submitRecovery}>
            <label htmlFor="recovery-email">Email address</label>
            <input id="recovery-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="signin-submit" type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
          </form>
        </>}

        {view === "signup" && <div className="signup-google-divider"><span>OR</span></div>}
        {isGoogleView && (GOOGLE_CLIENT_ID ? <div className={`google-button-wrap ${busy ? "is-busy" : ""}`} ref={buttonRef} /> : (
          <div className="signin-config-note">Google sign-in requires <code>VITE_GOOGLE_CLIENT_ID</code> in the frontend and <code>GOOGLE_CLIENT_ID</code> in the backend.</div>
        ))}
        {view === "signup" && <p className="signup-google-note">Already registered with Google? Choose Google below. Accounts are never linked automatically.</p>}
        {loading && <p className="signin-session-note" role="status">Restoring your saved session…</p>}
        {message && view !== "signup" && <p className={`signin-status ${messageKind === "success" ? "is-success" : ""}`} role={messageKind === "error" ? "alert" : "status"}>{message}</p>}
        {view === "signup" ? (
          <div className="signin-account-options">
            <p>Already have an account? <Link to="/sign-in" state={{ view: "login" }} onClick={() => changeView("login")}>Log in</Link></p>
          </div>
        ) : (
          <div className="signin-account-options">
            {view !== "login" && <p>Already have an account? <button type="button" onClick={() => changeView("login")}>Log in</button></p>}
            {view !== "signup" && <p>Don't have an account? <button type="button" onClick={() => changeView("signup")}>Sign up</button></p>}
          </div>
        )}
        {view === "recovery" && <button className="signin-text-button signin-back-link" type="button" onClick={() => changeView("login")}>Back to Log in</button>}
        {view !== "recovery" && <p className="signin-small">By continuing, you agree to use Coveilla kindly and safely.</p>}
      </div>
    </section>
  );
}
