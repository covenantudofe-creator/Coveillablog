export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5055";

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = Object.hasOwn(options, "token") ? options.token : localStorage.getItem("coveilla_token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || "The request could not be completed.");
  return payload;
}
