import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MyTicketDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const ticket = state || {};

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
    orderCode,
  } = ticket;

  const paymentMethodLabel = {
    momo: "MoMo",
    zalopay: "ZaloPay",
    visa: "Visa / MasterCard",
  };
  const displaySeatDetails =
    seatDetails.length > 0
      ? seatDetails
      : selectedSeats.map((seatCode) => ({ seatCode }));

  if (!state) {
    return (
      <div className="min-h-screen bg-[#06070d] px-6 text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center">
          <div className="w-full rounded-[28px] border border-white/10 bg-[#111624] p-8 text-center">
            <h1 className="text-3xl font-bold">Không có dữ liệu vé</h1>
            <p className="mt-3 text-white/60">
              Bạn chưa có thông tin vé để hiển thị.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-[#4F46E5]"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 rounded-[28px] border border-white/10 bg-[#111624] p-6">
          <h1 className=" text-4xl font-bold">Chi tiết vé đã đặt</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6">
              <p className="mb-5 text-xl uppercase tracking-[0.3em] white">
                Thông tin phim
              </p>

              <div className="flex flex-col gap-6 md:flex-row">
                <div className="shrink-0">
                  {poster ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${poster}`}
                      alt={movieTitle}
                      className="h-[290px] w-[200px] rounded-[24px] object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-[290px] w-[200px] items-center justify-center rounded-[24px] bg-white/10 text-white/50">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold uppercase leading-snug">
                    {movieTitle}
                  </h2>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {/* <InfoCard label="Screen" value={screenId} /> */}
                    <InfoCard label="Rạp" value={cinemaName} />
                    {/* <InfoCard label="Mã rạp" value={cinemaId} /> */}
                    <InfoCard label="Phòng chiếu" value={roomName} />
                    <InfoCard label="Ngày chiếu" value={showtimeDate} />
                    <InfoCard
                      label="Xuất chiếu"
                      value={showtimeTime || showtime}
                    />
                  </div>

                  {/* <div className="mt-5 rounded-2xl bg-white/5 p-4">
                    <p className="mb-3 font-semibold text-white/80">
                      Ghế đã đặt
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {displaySeatDetails.map((seat) => (
                        <span
                          key={seat.seatCode}
                          className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#4F46E5]"
                        >
                          {seat.seatCode}
                          {seat.seatType ? ` - ${seat.seatType}` : ""}
                        </span>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6">
              <p className="mb-5 text-sm uppercase tracking-[0.3em] text-white/40">
                Mã vé điện tử
              </p>

              <div className="rounded-3xl border border-dashed border-[#6366F1]/40 bg-gradient-to-r from-[#6366F1]/10 to-[#7C3AED]/10 p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-white/50">Mã đơn hàng</p>
                    <p className="mt-1 text-2xl font-bold text-[#A5B4FC]">
                      {orderCode || "TF-PENDING"}
                    </p>

                    <p className="mt-4 text-sm text-white/50">Trạng thái vé</p>
                    <div className="mt-2 inline-flex rounded-full bg-green-500/20 px-4 py-1 text-sm font-semibold text-green-400">
                      Đã thanh toán
                    </div>
                  </div>

                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-white p-4">
                    <div className="grid grid-cols-6 gap-1">
                      {[
                        1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1,
                        1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1,
                      ].map((cell, index) => (
                        <div
                          key={index}
                          className={`h-5 w-5 rounded-sm ${
                            cell ? "bg-black" : "bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6">
              <p className="mb-11 text-xl uppercase tracking-[0.3em] white">
                Tóm tắt vé
              </p>

              <div className="space-y-4 text-sm">
                <SummaryRow label="Screen" value={screenId || "N/A"} />
                <SummaryRow label="Tên phim" value={movieTitle} />
                <SummaryRow
                  label="Mã suất chiếu"
                  value={showtimeId || "Chưa có"}
                />
                <SummaryRow label="Rạp" value={cinemaName || "Chưa có"} />
                <SummaryRow label="Phòng" value={roomName || "Chưa có"} />
                <SummaryRow
                  label="Ngày chiếu"
                  value={showtimeDate || "Chưa có"}
                />
                <SummaryRow
                  label="Suất chiếu"
                  value={showtimeTime || showtime || "Chưa có"}
                />
                <SummaryRow
                  label="Ghế"
                  value={selectedSeats.join(", ") || "Chưa có"}
                />
                <SummaryRow
                  label="Số lượng"
                  value={`${selectedSeats.length} ghế`}
                />
                <SummaryRow
                  label="Thanh toán qua"
                  value={paymentMethodLabel[paymentMethod] || "Chưa chọn"}
                />
                <SummaryRow label="Mã đơn" value={orderCode || "Chưa có"} />
              </div>

              <div className="my-5 border-t border-white/10" />

              <div className="flex items-center justify-between pb-4">
                <span className="text-lg font-semibold text-white/70">
                  Tổng tiền
                </span>
                <span className="text-3xl font-bold text-yellow-400">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-6">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/40">
                Lưu ý
              </p>

              <div className="space-y-3 text-sm text-white/65">
                <p>• Vui lòng có mặt trước giờ chiếu ít nhất 15 phút.</p>
                <p>• Vé điện tử chỉ hợp lệ cho đúng suất chiếu đã đặt.</p>
                <p>• Không hoàn/hủy sau khi giao dịch thành công.</p>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="rounded-2xl bg-white px-5 py-3 font-semibold text-[#4F46E5]"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
