// Dùng relative URL → Vite proxy chuyển sang localhost:5001 khi dev
// Khi deploy production, cùng domain nên vẫn đúng
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_URL =
  (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") ||
  (API_BASE ? `${API_BASE}/api` : "/api");

async function parseResponse(res) {
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server trả về dữ liệu không hợp lệ (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.message || `Yêu cầu thất bại (${res.status})`);
  }

  return data;
}

// ─── Login ────────────────────────────────────────────────
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return parseResponse(res);
}


// ─── Signup ───────────────────────────────────────────────

export async function signupUser(email, password, fullName, phone) {
  const res = await fetch(`${API_URL}/auth/signup-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName, phone }),
  });

  return parseResponse(res);
}

// ─── Google Auth ──────────────────────────────────────────────
export async function googleAuthApi(accessToken) {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });

  return parseResponse(res);
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

// ─── Forgot Password ──────────────────────────────────────────
export async function forgotPasswordApi(email) {
  // Timeout 45 giây — Render free tier cold start có thể chậm
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });
    return parseResponse(res);
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Yêu cầu quá thời gian. Server có thể đang khởi động, vui lòng thử lại.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Reset Password ───────────────────────────────────────────
export async function resetPasswordApi(email, otp, newPassword) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
      signal: controller.signal,
    });
    return parseResponse(res);
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Yêu cầu quá thời gian. Vui lòng thử lại.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
