import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "./api";
import { AuthContext } from "./auth-context-value";

const pendingSessionChecks = new Map();

function validateSession(token) {
  if (!pendingSessionChecks.has(token)) {
    const pendingCheck = apiRequest("/api/auth/me", { token }).finally(() => {
      pendingSessionChecks.delete(token);
    });
    pendingSessionChecks.set(token, pendingCheck);
  }
  return pendingSessionChecks.get(token);
}

function saveSession(session) {
  localStorage.setItem("coveilla_token", session.token);
  localStorage.setItem("coveilla_user", JSON.stringify(session.user));
  return session.user;
}

function clearSession() {
  localStorage.removeItem("coveilla_token");
  localStorage.removeItem("coveilla_user");
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("coveilla_token"));
  const [user, setUser] = useState(() => {
    if (!localStorage.getItem("coveilla_token")) return null;
    try { return JSON.parse(localStorage.getItem("coveilla_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(token));
  const sessionCheckId = useRef(0);
  const skipSessionCheckToken = useRef(null);

  useEffect(() => {
    const checkId = ++sessionCheckId.current;
    let active = true;
    if (!token) return undefined;
    if (skipSessionCheckToken.current === token) {
      skipSessionCheckToken.current = null;
      setLoading(false);
      return undefined;
    }
    validateSession(token)
      .then(({ user: currentUser }) => {
        if (!active || checkId !== sessionCheckId.current) return;
        setUser(currentUser);
        localStorage.setItem("coveilla_user", JSON.stringify(currentUser));
      })
      .catch(() => {
        if (!active || checkId !== sessionCheckId.current) return;
        clearSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (active && checkId === sessionCheckId.current) setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  const acceptSession = useCallback((session) => {
    sessionCheckId.current += 1;
    skipSessionCheckToken.current = session.token;
    const nextUser = saveSession(session);
    setToken(session.token);
    setUser(nextUser);
    setLoading(false);
    return nextUser;
  }, []);

  const signInWithGoogle = useCallback(async (credential) => {
    const session = await apiRequest("/api/auth/google", {
      method: "POST", token: null, body: JSON.stringify({ credential }),
    });
    acceptSession(session);
    return session;
  }, [acceptSession]);

  const signInAdmin = useCallback(async (username, password) => {
    const session = await apiRequest("/api/auth/login", {
      method: "POST", token: null, body: JSON.stringify({ username, password }),
    });
    acceptSession(session);
    return session;
  }, [acceptSession]);

  const signInReader = useCallback(async (email, password) => {
    const session = await apiRequest("/api/auth/reader/login", {
      method: "POST", token: null, body: JSON.stringify({ email, password }),
    });
    acceptSession(session);
    return session;
  }, [acceptSession]);

  const registerReader = useCallback((name, email, password) => apiRequest("/api/auth/reader/register", {
    method: "POST", token: null, body: JSON.stringify({ name, email, password }),
  }), []);

  const signOut = useCallback(() => {
    sessionCheckId.current += 1;
    try {
      window.google?.accounts?.id?.disableAutoSelect?.();
    } catch {
      // Google sign-out hints must not prevent Coveilla from clearing its session.
    }
    clearSession();
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    token, user, loading,
    signInWithGoogle,
    signInAdmin,
    signInReader,
    registerReader,
    signOut,
  }), [token, user, loading, signInWithGoogle, signInAdmin, signInReader, registerReader, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
