import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkPaymentStatus } from "../services/paymentService";

export default function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const resultCode = searchParams.get("resultCode");

  const [status, setStatus] = useState("loading"); // loading | success | failed | unknown
  const [bookingInfo, setBookingInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStatus() {
      if (!orderId) {
        setStatus("unknown");
        return;
      }

      // Always verify from backend as the authoritative source
      try {
        const data = await checkPaymentStatus(orderId);
        setBookingInfo(data);
        if (data.status === "PAID" || data.paymentStatus === "PAID") {
          setStatus("success");
        } else if (data.status === "CANCELLED" || data.paymentStatus === "FAILED") {
          setStatus("failed");
        } else {
          // Booking is still PENDING — use MoMo redirect resultCode as hint
          if (resultCode !== null) {
            setStatus(resultCode === "0" ? "success" : "failed");
          } else {
            setStatus("unknown");
          }
        }
      } catch (err) {
        setError(err.message || "Không thể kiểm tra trạng thái thanh toán.");
        // Fall back to URL param if backend is unavailable
        if (resultCode !== null) {
          setStatus(resultCode === "0" ? "success" : "failed");
        } else {
          setStatus("unknown");
        }
      }
    }

    fetchStatus();
  }, [orderId, resultCode]);

  return (
    <div className="min-h-screen bg-[#06070d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <h1 className="text-2xl font-bold">Đang kiểm tra thanh toán...</h1>
            <p className="mt-3 text-white/60">Vui lòng đợi trong giây lát.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <svg
                className="h-10 w-10 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-400">Thanh toán thành công!</h1>
            <p className="mt-3 text-white/70">
              Vé của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng BookingFlix!
            </p>
            {bookingInfo && (
              <div className="mt-5 rounded-2xl bg-white/5 p-4 text-left text-sm space-y-2">
                {bookingInfo.orderCode && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Mã đặt vé</span>
                    <span className="font-semibold">{bookingInfo.orderCode}</span>
                  </div>
                )}
                {bookingInfo.movieTitle && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Phim</span>
                    <span className="font-semibold">{bookingInfo.movieTitle}</span>
                  </div>
                )}
                {bookingInfo.selectedSeats?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Ghế</span>
                    <span className="font-semibold">{bookingInfo.selectedSeats.join(", ")}</span>
                  </div>
                )}
                {bookingInfo.totalAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Tổng tiền</span>
                    <span className="font-semibold text-yellow-400">
                      {Number(bookingInfo.totalAmount).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 grid gap-3">
              <button
                onClick={() => navigate("/ticket")}
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-[#4F46E5] transition hover:scale-[1.02]"
              >
                Xem vé của tôi
              </button>
              <button
                onClick={() => navigate("/")}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Về trang chủ
              </button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
              <svg
                className="h-10 w-10 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-red-400">Thanh toán thất bại</h1>
            <p className="mt-3 text-white/70">
              Giao dịch không thành công hoặc đã bị huỷ. Vui lòng thử lại.
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-300/70">{error}</p>
            )}
            <div className="mt-6 grid gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-[#4F46E5] transition hover:scale-[1.02]"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate("/")}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Về trang chủ
              </button>
            </div>
          </>
        )}

        {status === "unknown" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20">
              <svg
                className="h-10 w-10 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-yellow-400">Không xác định</h1>
            <p className="mt-3 text-white/70">
              Trạng thái thanh toán chưa rõ. Vui lòng kiểm tra vé của bạn hoặc liên hệ hỗ trợ.
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-300/70">{error}</p>
            )}
            <div className="mt-6 grid gap-3">
              <button
                onClick={() => navigate("/ticket")}
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-[#4F46E5] transition hover:scale-[1.02]"
              >
                Xem vé của tôi
              </button>
              <button
                onClick={() => navigate("/")}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Về trang chủ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
