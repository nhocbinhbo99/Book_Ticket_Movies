import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createBooking, getStoredAuthToken } from "../services/bookings";
import { createMoMoOrder } from "../services/paymentService";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user, loading: authLoading } = useAuth();
  const authToken = token || getStoredAuthToken();

  const booking = state || {};

  const {
    movieTitle,
    poster,
    cinemaName,
    cinemaId,
    screenId,
    roomName,
    showtime,
    showtimeDate,
    showtimeTime,
    showtimeId,
    selectedSeats = [],
    seatDetails = [],
    totalPrice = 0,
    paymentMethod,
  } = booking;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const paymentMethodLabel = {
    momo: "MoMo",
    zalopay: "ZaloPay",
    visa: "Visa / MasterCard",
  };

  const handleCompletePayment = async () => {
    if (!authToken) {
      setBookingError("Vui lòng đăng nhập để đặt vé.");
      return;
    }

    setIsSubmitting(true);
    setBookingError("");

    try {
      // If payment method is MoMo, redirect to MoMo payment gateway
      if (paymentMethod === "momo") {
        const result = await createMoMoOrder(
          {
            showtimeId,
            movieTitle,
            cinemaId,
            cinemaName,
            screenId,
            roomName,
            selectedSeats,
            seats: seatDetails,
            totalPrice,
            paymentMethod,
            customerName: user?.fullName,
            email: user?.email,
            phone: user?.phone,
          },
          authToken,
        );

        if (result.payUrl) {
          // Redirect to MoMo payment page
          window.location.href = result.payUrl;
          return;
        }

        setBookingError("Không lấy được link thanh toán MoMo. Vui lòng thử lại.");
        return;
      }

      // For other payment methods, create booking directly (existing flow)
      const result = await createBooking(
        {
          showtimeId,
          movieTitle,
          cinemaId,
          cinemaName,
          screenId,
          roomName,
          selectedSeats,
          seats: seatDetails,
          totalPrice,
          paymentMethod,
          customerName: user?.fullName,
          email: user?.email,
          phone: user?.phone,
        },
        authToken,
      );
      const savedBooking = result.booking || {};

      navigate("/my-ticket-detail", {
        state: {
          ...state,
          ...savedBooking,
          poster,
          paymentMethod,
          selectedSeats: savedBooking.selectedSeats || selectedSeats,
          seatDetails: savedBooking.seats || seatDetails,
          totalPrice: savedBooking.totalPrice ?? totalPrice,
        },
      });
    } catch (error) {
      const soldSeats = error.payload?.soldSeats;
      setBookingError(
        error.status === 401 || error.code === "AUTH_REQUIRED"
          ? "Vui lòng đăng nhập để đặt vé."
          : soldSeats?.length
            ? `Seats already booked: ${soldSeats.join(", ")}`
            : error.message || "Cannot create booking. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-[#06070d] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-bold">Không có dữ liệu đặt vé</h1>
          <p className="mt-3 text-white/70">
            Bạn chưa chọn ghế hoặc dữ liệu thanh toán không tồn tại.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-[#4F46E5] transition hover:scale-[1.02]"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!authLoading && !authToken) {
    return (
      <div className="min-h-screen bg-[#06070d] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-bold">Vui lòng đăng nhập để đặt vé</h1>
          <p className="mt-3 text-white/70">
            Bạn cần đăng nhập trước khi hoàn tất thanh toán và lưu vé vào tài khoản.
          </p>
          <button
            onClick={() => navigate("/account")}
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-[#4F46E5] transition hover:scale-[1.02]"
          >
            Đăng nhập / Đăng ký
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070d] text-white">
      <div className="relative z-50 mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-[#1b2033] via-[#151a2c] to-[#0f1322] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">
            Payment
          </p>
          <h1 className="mt-2 text-4xl font-bold">Màn hình thanh toán</h1>
          <p className="mt-2 text-white/60">
            Xác nhận thông tin vé và hoàn tất giao dịch của bạn.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Movie + ticket info */}
            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <p className="mb-5 text-sm uppercase tracking-[0.3em] text-white/40">
                Thông tin vé
              </p>

              <div className="flex flex-col gap-6 md:flex-row">
                <div className="shrink-0">
                  {poster ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${poster}`}
                      alt={movieTitle}
                      className="h-[280px] w-[190px] rounded-[24px] object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-[280px] w-[190px] items-center justify-center rounded-[24px] bg-white/10 text-white/50">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold uppercase leading-snug">
                    {movieTitle}
                  </h2>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <InfoCard label="Screen" value={screenId} />
                    <InfoCard label="Rạp" value={cinemaName} />
                    <InfoCard label="Mã rạp" value={cinemaId} />
                    <InfoCard label="Phòng chiếu" value={roomName} />
                    <InfoCard label="Ngày chiếu" value={showtimeDate} />
                    <InfoCard
                      label="Xuất chiếu"
                      value={showtimeTime || showtime || "Chưa cập nhật"}
                    />
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/5 p-4">
                    <p className="mb-3 font-semibold text-white/80">
                      Ghế đã chọn
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.length > 0 ? (
                        selectedSeats.map((seat) => (
                          <span
                            key={seat}
                            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#4F46E5]"
                          >
                            {seat}
                          </span>
                        ))
                      ) : (
                        <p className="text-white/50">Chưa chọn ghế</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <p className="mb-5 text-sm uppercase tracking-[0.3em] text-white/40">
                Phương thức thanh toán
              </p>

              <div className="rounded-2xl border border-[#6366F1]/20 bg-gradient-to-r from-[#6366F1]/15 to-[#7C3AED]/10 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">
                      {paymentMethodLabel[paymentMethod] || "Chưa chọn"}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Phương thức đã chọn từ popup xác nhận thanh toán
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium">
                    {paymentMethodLabel[paymentMethod] || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <p className="mb-5 text-sm uppercase tracking-[0.3em] text-white/40">
                Tóm tắt đơn hàng
              </p>

              <div className="space-y-4 text-sm">
                <SummaryRow label="Screen" value={screenId || "N/A"} />
                <SummaryRow label="Tên phim" value={movieTitle} />
                <SummaryRow label="Mã suất chiếu" value={showtimeId || "Chưa có"} />
                <SummaryRow label="Rạp" value={cinemaName || "Chưa có"} />
                <SummaryRow label="Phòng" value={roomName || "Chưa có"} />
                <SummaryRow label="Ngày chiếu" value={showtimeDate || "Chưa có"} />
                <SummaryRow
                  label="Suất chiếu"
                  value={showtimeTime || showtime || "Chưa có"}
                />
                <SummaryRow
                  label="Số lượng ghế"
                  value={`${selectedSeats.length} ghế`}
                />
                <SummaryRow
                  label="Ghế"
                  value={selectedSeats.join(", ") || "Chưa có"}
                />
                <SummaryRow
                  label="Thanh toán qua"
                  value={paymentMethodLabel[paymentMethod] || "Chưa chọn"}
                />
              </div>

              <div className="my-5 border-t border-white/10" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white/70">
                  Tổng tiền
                </span>
                <span className="text-3xl font-bold text-yellow-400">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            {/* Payment block */}
            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/40">
                Thanh toán
              </p>

              {paymentMethod === "momo" ? (
                <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-3xl bg-[#ae2070] p-4">
                  <div className="flex flex-col items-center gap-2 text-white">
                    <svg viewBox="0 0 48 48" className="h-20 w-20 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 6c7.732 0 14 6.268 14 14s-6.268 14-14 14S10 31.732 10 24 16.268 10 24 10zm-4 8v12h3v-9l3 5 3-5v9h3V18h-3l-3 5-3-5h-3z" />
                    </svg>
                    <span className="text-sm font-semibold">MoMo Sandbox</span>
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-3xl bg-white p-4">
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 36 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-7 w-7 rounded-sm bg-black`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-4 text-sm text-white/60">
                {paymentMethod === "momo"
                  ? "Nhấn Thanh toán để chuyển tới cổng thanh toán MoMo"
                  : `Quét mã để thanh toán bằng ${paymentMethodLabel[paymentMethod] || "phương thức đã chọn"}`}
              </p>

              <div className="mt-6 grid gap-3">
                {bookingError && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                    {bookingError}
                  </div>
                )}

                <button
                  onClick={() => navigate(-1)}
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Quay lại chọn ghế
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={handleCompletePayment}
                  className={`rounded-2xl px-6 py-3 font-semibold ${getPayButtonClass(isSubmitting, paymentMethod)}`}
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : paymentMethod === "momo"
                      ? "Thanh toán qua MoMo"
                      : "Thanh toán"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPayButtonClass(submitting, method) {
  if (submitting) return "cursor-not-allowed bg-gray-500/40 text-white/50";
  if (method === "momo") return "bg-[#ae2070] text-white hover:bg-[#c02580]";
  return "bg-white text-[#4F46E5]";
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-1 font-semibold text-white">{value || "Chưa có"}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-white/55">{label}</span>
      <span className="max-w-[180px] text-right font-medium text-white">
        {value}
      </span>
    </div>
  );
}
