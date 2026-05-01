const API_URL =
  (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") ||
  ((import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")
    ? `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/api`
    : "/api");
const AUTH_TOKEN_KEY = "tf_token";

function createAuthRequiredError(message) {
  const error = new Error(message);
  error.code = "AUTH_REQUIRED";
  error.status = 401;
  return error;
}

function normalizeToken(token = "") {
  const normalized = String(token || "")
    .replace(/^Bearer\s+/i, "")
    .trim();

  return normalized && normalized !== "null" && normalized !== "undefined"
    ? normalized
    : "";
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") return "";
  return normalizeToken(localStorage.getItem(AUTH_TOKEN_KEY));
}

function resolveAuthToken(token = "") {
  return normalizeToken(token) || getStoredAuthToken();
}

function getAuthHeaders(token = "") {
  const authToken = resolveAuthToken(token);
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

async function parseResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`);
    error.payload = data;
    error.status = res.status;
    throw error;
  }

  return data;
}

export async function createBooking(payload = {}, token = "") {
  const authToken = resolveAuthToken(token);

  if (!authToken) {
    throw createAuthRequiredError("Vui lòng đăng nhập để đặt vé.");
  }

  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(authToken),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function getMyBookings(token = "") {
  const authToken = resolveAuthToken(token);

  if (!authToken) {
    throw createAuthRequiredError("Vui lòng đăng nhập để xem vé của bạn.");
  }

  const res = await fetch(`${API_URL}/bookings/my`, {
    headers: getAuthHeaders(authToken),
  });

  return parseResponse(res);
}
