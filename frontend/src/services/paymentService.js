const API_URL =
  (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") ||
  ((import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")
    ? `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/api`
    : "/api");

/**
 * Create a MoMo payment order.
 * Returns { success, payUrl, orderId, bookingId }
 */
export async function createMoMoOrder(bookingData = {}, token = "") {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/payment/create-momo-order`, {
    method: "POST",
    headers,
    body: JSON.stringify(bookingData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || `Payment request failed (${res.status})`);
    error.payload = data;
    error.status = res.status;
    throw error;
  }

  return data;
}

/**
 * Check the payment status for a given MoMo orderId.
 * Returns { orderId, bookingId, orderCode, status, paymentStatus, transactionId, ... }
 */
export async function checkPaymentStatus(orderId = "") {
  const res = await fetch(`${API_URL}/payment/check-status/${encodeURIComponent(orderId)}`);

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || `Status check failed (${res.status})`);
    error.payload = data;
    error.status = res.status;
    throw error;
  }

  return data;
}
