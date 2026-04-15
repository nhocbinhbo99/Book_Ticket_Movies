// Dùng relative URL → Vite proxy chuyển sang localhost:5001 khi dev
// Khi deploy production, cùng domain nên vẫn đúng
const API_URL = "/api";
// const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
// const API_URL = `${BASE}/api`;
// ─── Login ────────────────────────────────────────────────
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
  return data; // { message, token, user }
}

// ─── Signup ───────────────────────────────────────────────
export async function signupUser(email, password, fullName, phone) {
  const res = await fetch(`${API_URL}/auth/signup-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName, phone }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");
  return data; // { message, token, user }
}

// ─── Google Auth ──────────────────────────────────────────────
export async function googleAuthApi(accessToken) {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng nhập Google thất bại");
  return data; // { message, token, user }
}

// ─── Update Profile ───────────────────────────────────────────
export async function updateProfileApi(token, { fullName, phone, avatar }) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fullName, phone, avatar }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");
  return data; // { message, user }
}
