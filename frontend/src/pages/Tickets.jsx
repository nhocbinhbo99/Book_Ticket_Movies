import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyBookings, getStoredAuthToken } from "../services/bookings";

const paymentMethodLabel = {
  momo: "MoMo",
  zalopay: "ZaloPay",
  visa: "Visa / MasterCard",
};

const statusLabel = {
  PAID: "Đã thanh toán",
  PENDING: "Đang chờ",
  CANCELLED: "Đã hủy",
};

const formatCurrency = (amount = 0) =>
  `${Number(amount || 0).toLocaleString("vi-VN")}đ`;

const formatDateTime = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getShowtimeParts = (ticket) => {
  const { showtime } = ticket;
  if (!showtime?.startTime) {
    return { dateLabel: "Chưa cập nhật", timeLabel: "" };
  }

  const start = new Date(showtime.startTime);
  const end = showtime.endTime ? new Date(showtime.endTime) : null;

  if (Number.isNaN(start.getTime())) {
    return { dateLabel: "Chưa cập nhật", timeLabel: "" };
  }

  const dateLabel = start.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const startLabel = start.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endLabel =
    end && !Number.isNaN(end.getTime())
      ? end.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return {
    dateLabel,
    timeLabel: `${startLabel}${endLabel ? ` - ${endLabel}` : ""}`,
  };
};

const formatShowtime = (ticket) => {
  const { dateLabel, timeLabel } = getShowtimeParts(ticket);
  return timeLabel ? `${dateLabel}, ${timeLabel}` : dateLabel;
};

const getSeatsLabel = (ticket) => {
  const selectedSeats = Array.isArray(ticket.selectedSeats)
    ? ticket.selectedSeats
    : [];
  const seatCodes = selectedSeats.length
    ? selectedSeats
    : (ticket.seats || []).map((seat) => seat.seatCode).filter(Boolean);

  return seatCodes.length ? seatCodes.join(", ") : "Chưa có";
};

function Tickets() {
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();
  const authToken = token || getStoredAuthToken();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!authToken) {
      setTickets([]);
      setIsLoading(false);
      setError("");
      setAuthRequired(true);
      return undefined;
    }

    setAuthRequired(false);
    let ignore = false;

    const fetchTickets = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getMyBookings(authToken);
        if (!ignore) {
          setTickets(Array.isArray(data?.bookings) ? data.bookings : []);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err.status === 401 || err.code === "AUTH_REQUIRED"
              ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
              : err.message || "Không thể tải vé của bạn.";
          setError(message);
          setAuthRequired(err.status === 401 || err.code === "AUTH_REQUIRED");
          setTickets([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchTickets();

    return () => {
      ignore = true;
    };
  }, [authLoading, authToken]);

  const openTicketDetail = (ticket) => {
    const { dateLabel, timeLabel } = getShowtimeParts(ticket);

    navigate("/my-ticket-detail", {
      state: {
        ...ticket,
        showtimeDate: dateLabel,
        showtimeTime: timeLabel,
        selectedSeats: ticket.selectedSeats || [],
        seatDetails: ticket.seats || [],
        totalPrice: ticket.totalAmount || ticket.totalPrice || 0,
      },
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-6 pt-28 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-b-2 border-t-2 border-yellow-500" />
          <p className="text-white/70">Đang tải vé của bạn...</p>
        </div>
      </div>
    );
  }

  if ((!authLoading && !authToken) || authRequired) {
    return (
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-28 text-white">
        <div className="rounded-[28px] border border-white/10 bg-[#111624] p-8 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">
            My Tickets
          </p>
          <h1 className="mt-3 text-3xl font-bold">Vui lòng đăng nhập</h1>
          <p className="mt-3 text-white/60">
            {error || "Đăng nhập để xem những vé bạn đã đặt trên TicketFlix."}
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
    <div className="mx-auto max-w-6xl px-6 pb-12 pt-28 text-white">
      <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-[#1b2033] via-[#151a2c] to-[#0f1322] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <p className="text-sm uppercase tracking-[0.35em] text-white/40">
          My Tickets
        </p>
        <h1 className="mt-2 text-4xl font-bold">Vé của tôi</h1>
        <p className="mt-2 text-white/60">
          Tất cả vé đã đặt bằng tài khoản hiện tại sẽ xuất hiện ở đây.
        </p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-100">
          {error}
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#111624] p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold">Bạn chưa đặt vé nào</h2>
          <p className="mt-3 text-white/60">
            Khi bạn đặt vé thành công, vé sẽ được lưu vào tài khoản và hiển thị
            tại đây.
          </p>
          <button
            onClick={() => navigate("/movie")}
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-[#4F46E5] transition hover:scale-[1.02]"
          >
            Xem phim đang chiếu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {tickets.map((ticket) => {
            const status =
              statusLabel[ticket.status] || ticket.status || "Chưa cập nhật";

            return (
              <article
                key={ticket.id || ticket.orderCode}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111624] shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-yellow-400/40"
              >
                <div className="border-b border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                        {ticket.orderCode || "TF-PENDING"}
                      </p>
                      <h2 className="mt-2 line-clamp-2 text-2xl font-bold">
                        {ticket.movieTitle || "Chưa có tên phim"}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-300">
                      {status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5 text-sm">
                  <TicketRow
                    label="Rạp"
                    value={ticket.cinemaName || "Chưa cập nhật"}
                  />
                  <TicketRow
                    label="Phòng"
                    value={ticket.roomName || "Chưa cập nhật"}
                  />
                  <TicketRow
                    label="Suất chiếu"
                    value={formatShowtime(ticket)}
                  />
                  <TicketRow label="Ghế" value={getSeatsLabel(ticket)} />
                  <TicketRow
                    label="Thanh toán"
                    value={
                      paymentMethodLabel[ticket.paymentMethod] ||
                      ticket.paymentMethod ||
                      "Chưa cập nhật"
                    }
                  />
                  <TicketRow
                    label="Thời gian đặt"
                    value={formatDateTime(ticket.createdAt)}
                  />

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-white/60">Tổng tiền</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      {formatCurrency(ticket.totalAmount || ticket.totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => openTicketDetail(ticket)}
                    className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-[#4F46E5] transition hover:scale-[1.01]"
                  >
                    Xem chi tiết vé
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TicketRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-white/55">{label}</span>
      <span className="max-w-[260px] text-right font-medium text-white">
        {value}
      </span>
    </div>
  );
}

export default Tickets;
