import React, { useEffect, useState } from "react";

export default function PaymentPopup({
  isOpen,
  onClose,
  onConfirm,
  movieTitle,
  cinemaName,
  roomName,
  showtime,
  selectedSeats = [],
  totalPrice = 0,
}) {
  const [selectedMethod, setSelectedMethod] = useState("momo");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const paymentMethods = [
    {
      id: "momo",
      name: "MoMo",
      desc: "Thanh toán nhanh bằng ví MoMo",
      icon: "💜",
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      desc: "Thanh toán qua ví ZaloPay",
      icon: "💙",
    },
    {
      id: "visa",
      name: "Visa / MasterCard",
      desc: "Thanh toán bằng thẻ quốc tế",
      icon: "💳",
    },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-2xl translate-y-0 scale-100 overflow-hidden rounded-3xl border border-white/10 bg-[#131726] text-white opacity-100 shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-all duration-300"
      >
        {/* Header */}
        <div className="relative border-b border-white/10 bg-gradient-to-r from-[#1d2440] via-[#1b1f35] to-[#111827] px-6 py-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-red-500"
          >
            ✕
          </button>

          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            Payment
          </p>
          <h2 className="mt-1 text-3xl font-bold">Xác nhận thanh toán</h2>
          <p className="mt-2 text-sm text-white/60">
            Kiểm tra thông tin vé và chọn phương thức thanh toán
          </p>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Left */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/40">
                Thông tin vé
              </p>

              <h3 className="text-xl font-bold leading-snug text-white">
                {movieTitle}
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-white/60">Rạp</span>
                  <span className="text-right font-medium">{cinemaName}</span>
                </div>

                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-white/60">Phòng</span>
                  <span className="text-right font-medium">{roomName}</span>
                </div>

                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-white/60">Xuất chiếu</span>
                  <span className="text-right font-medium">
                    {showtime || "Chưa cập nhật"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-white/60">Ghế đã chọn</span>
                  <div className="flex max-w-[220px] flex-wrap justify-end gap-2">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#4F46E5]"
                        >
                          {seat}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-white/50">
                        Chưa chọn ghế
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#4F46E5]/20 bg-gradient-to-r from-[#4F46E5]/15 to-[#7C3AED]/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white/80">
                  Tổng thanh toán
                </span>
                <span className="text-3xl font-bold text-yellow-400">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/40">
                Phương thức thanh toán
              </p>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const active = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-[#6366F1] bg-[#6366F1]/15 shadow-[0_0_0_1px_rgba(99,102,241,0.3)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                            {method.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {method.name}
                            </p>
                            <p className="text-sm text-white/55">
                              {method.desc}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`h-5 w-5 rounded-full border-2 ${
                            active
                              ? "border-[#818CF8] bg-[#818CF8]"
                              : "border-white/30"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-100">
              Sau khi nhấn{" "}
              <span className="font-semibold">“Xác nhận thanh toán”</span>, hệ
              thống sẽ chuyển bạn sang màn hình thanh toán với đầy đủ thông tin
              vé.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.03] px-6 py-5 sm:flex-row">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Quay lại
          </button>

          <button
            disabled={selectedSeats.length === 0}
            onClick={() =>
              onConfirm({
                paymentMethod: selectedMethod,
              })
            }
            className={`flex-1 rounded-2xl px-5 py-3 font-semibold transition ${
              selectedSeats.length === 0
                ? "cursor-not-allowed bg-gray-500/40 text-white/50"
                : "bg-white text-[#4F46E5] hover:scale-[1.02] hover:shadow-xl"
            }`}
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
