const API_URL = import.meta.env.VITE_API_BASE_URL + "/api" || "http://localhost:5001/api";

export async function getTasks() {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Fetch /api/tasks failed");
  return res.text(); // backend đang trả text
}

// Login User (email + password)
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  return data;
}

// Signup User (email + password + fullName)
export async function signupUser(email, password, fullName) {
  const res = await fetch(`${API_URL}/auth/signup-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, fullName }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data;
}