const API_URL =
  (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") ||
  ((import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")
    ? `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/api`
    : "/api");

function resolveAuthToken(token = "") {
  const normalized = String(token || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
  return normalized && normalized !== "null" && normalized !== "undefined"
    ? normalized
    : localStorage.getItem("tf_token")?.replace(/^Bearer\s+/i, "")?.trim() || "";
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

export async function getFavorites(token = "") {
  const authToken = resolveAuthToken(token);
  if (!authToken) throw new Error("Vui lòng đăng nhập để xem danh sách yêu thích.");

  const res = await fetch(`${API_URL}/auth/favorites`, {
    headers: getAuthHeaders(authToken),
  });

  return parseResponse(res);
}

export async function toggleFavorite(movieId, token = "") {
  const authToken = resolveAuthToken(token);
  if (!authToken) throw new Error("Vui lòng đăng nhập để thao tác.");

  const res = await fetch(`${API_URL}/auth/favorites/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(authToken),
    },
    body: JSON.stringify({ movieId }),
  });

  return parseResponse(res);
}
