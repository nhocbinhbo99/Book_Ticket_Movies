const API_URL =
  (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") ||
  ((import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")
    ? `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/api`
    : "/api");

async function parseResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

export async function getShowtimes(params = {}, options = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/showtimes${query ? `?${query}` : ""}`, {
    signal: options.signal,
  });
  return parseResponse(res);
}

export async function getShowtimeSeats(showtimeId, options = {}) {
  const res = await fetch(`${API_URL}/showtimes/${showtimeId}/seats`, {
    signal: options.signal,
  });

  return parseResponse(res);
}

export async function generateShowtimes(payload = {}) {
  const res = await fetch(`${API_URL}/showtimes/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function getCinemas() {
  const res = await fetch(`${API_URL}/cinemas`);
  return parseResponse(res);
}

export async function getCinemaRooms(cinemaId) {
  const res = await fetch(`${API_URL}/cinemas/${cinemaId}/rooms`);
  return parseResponse(res);
}
