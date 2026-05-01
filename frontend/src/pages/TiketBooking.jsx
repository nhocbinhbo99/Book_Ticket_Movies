import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LegendItems from "../components/LegendItems";
import PaymentPopup from "../components/PaymentPopup";
import Seat from "../components/Seat";
import {
  generateShowtimes,
  getShowtimeSeats,
  getShowtimes,
} from "../services/showtimes";

const MAX_SHOWTIMES_PER_DATE = 9;

const formatCurrency = (amount = 0) =>
  `${Number(amount || 0).toLocaleString("vi-VN")}đ`;

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateLabel = (dateKey) =>
  parseDateKey(dateKey).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

const formatFullDate = (dateKey) =>
  parseDateKey(dateKey).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatShowtimeText = (showtime) => {
  if (!showtime) return "";
  return `${showtime.startTimeLabel} - ${showtime.endTimeLabel}, ${formatFullDate(showtime.date)}`;
};

function buildDateOptions(showtimes) {
  const keys = new Set(
    showtimes.map((showtime) => showtime.date).filter(Boolean),
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    keys.add(getDateKey(date));
  }

  return Array.from(keys)
    .sort()
    .slice(0, 7)
    .map((dateKey) => ({
      dateKey,
      label: formatDateLabel(dateKey),
      isToday: dateKey === getDateKey(today),
    }));
}

function buildSeatData(showtimeSeats) {
  if (!showtimeSeats?.room) return null;

  return {
    ...showtimeSeats.room,
    showtimeId: showtimeSeats.showtimeId,
    soldSeats: showtimeSeats.soldSeats || [],
  };
}

function getSeatType(rowLabel, roomLayout) {
  if ((roomLayout?.coupleRows || []).includes(rowLabel)) return "COUPLE";
  if ((roomLayout?.vipRows || []).includes(rowLabel)) return "VIP";
  return "STANDARD";
}

function getSeatPrice(seatType, roomLayout) {
  const prices = roomLayout?.prices || {};

  if (seatType === "COUPLE") return Number(prices.couple) || 0;
  if (seatType === "VIP") return Number(prices.vip) || 0;
  return Number(prices.standard) || 0;
}

function buildSelectedSeatDetails(roomLayout, selectedSeats) {
  if (!roomLayout) return [];

  return selectedSeats.map((seatCode) => {
    const rowLabel = seatCode.charAt(0);
    const seatType = getSeatType(rowLabel, roomLayout);

    return {
      seatCode,
      seatType,
      price: getSeatPrice(seatType, roomLayout),
    };
  });
}

export default function TicketBooking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movieError, setMovieError] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [showtimeError, setShowtimeError] = useState("");
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
  const [showtimeSeats, setShowtimeSeats] = useState(null);
  const [seatError, setSeatError] = useState("");
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date()),
  );
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const showtimeCacheRef = useRef(new Map());
  const generatedMoviesRef = useRef(new Set());

  useEffect(() => {
    let ignore = false;

    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`,
        );
        const data = await res.json();
        if (!ignore) setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
        if (!ignore) setMovieError("Không thể tải thông tin phim.");
      }
    };

    fetchMovie();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !movie) return undefined;
    const controller = new AbortController();
    const cacheKey = `${id}:upcoming`;
    const cachedShowtimes = showtimeCacheRef.current.get(cacheKey);

    if (cachedShowtimes) {
      setShowtimes(cachedShowtimes);
      setShowtimeError("");
      setIsLoadingShowtimes(false);
      setSelectedDate((currentDate) => {
        if (cachedShowtimes.some((showtime) => showtime.date === currentDate)) {
          return currentDate;
        }

        return cachedShowtimes[0]?.date || currentDate;
      });
      return undefined;
    }

    const fetchShowtimes = async () => {
      setIsLoadingShowtimes(true);
      setShowtimeError("");
      setShowtimes([]);

      try {
        let data = await getShowtimes(
          { movieId: id },
          { signal: controller.signal },
        );
        let nextShowtimes = Array.isArray(data) ? data : [];

        if (
          nextShowtimes.length === 0 &&
          !generatedMoviesRef.current.has(id)
        ) {
          generatedMoviesRef.current.add(id);
          await generateShowtimes({
            movieId: id,
            days: 7,
            durationMinutes: movie.runtime,
            metadata: {
              title: movie.title,
              poster: movie.poster_path,
              poster_path: movie.poster_path,
              releaseDate: movie.release_date,
              rating: movie.vote_average,
              durationMinutes: movie.runtime,
            },
          });

          data = await getShowtimes(
            { movieId: id },
            { signal: controller.signal },
          );
          nextShowtimes = Array.isArray(data) ? data : [];
        }

        if (controller.signal.aborted) return;

        showtimeCacheRef.current.set(cacheKey, nextShowtimes);
        setShowtimes(nextShowtimes);
        setSelectedDate((currentDate) => {
          if (nextShowtimes.some((showtime) => showtime.date === currentDate)) {
            return currentDate;
          }

          return nextShowtimes[0]?.date || currentDate;
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching showtimes:", error);
        setShowtimeError("Cannot load showtimes. Please try again.");
      } finally {
        if (!controller.signal.aborted) setIsLoadingShowtimes(false);
      }
    };

    fetchShowtimes();

    return () => {
      controller.abort();
    };
  }, [id, movie]);

  const dateOptions = useMemo(() => buildDateOptions(showtimes), [showtimes]);

  const showtimesForDate = useMemo(
    () => showtimes.filter((showtime) => showtime.date === selectedDate),
    [selectedDate, showtimes],
  );

  const availableShowtimes = useMemo(
    () =>
      showtimesForDate
        .slice()
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, MAX_SHOWTIMES_PER_DATE),
    [showtimesForDate],
  );

  const selectedShowtime = useMemo(
    () =>
      showtimes.find((showtime) => showtime.id === selectedShowtimeId) || null,
    [selectedShowtimeId, showtimes],
  );

  const activeSeatData = useMemo(
    () => buildSeatData(showtimeSeats),
    [showtimeSeats],
  );

  const selectedSeatDetails = useMemo(
    () => buildSelectedSeatDetails(activeSeatData, selectedSeat),
    [activeSeatData, selectedSeat],
  );

  const totalPrice = useMemo(
    () => selectedSeatDetails.reduce((sum, seat) => sum + seat.price, 0),
    [selectedSeatDetails],
  );

  useEffect(() => {
    setSelectedShowtimeId("");
  }, [selectedDate]);

  useEffect(() => {
    setSelectedSeat([]);
    setShowtimeSeats(null);
    setSeatError("");

    if (!selectedShowtimeId) {
      setIsLoadingSeats(false);
      return undefined;
    }

    const controller = new AbortController();

    const fetchShowtimeSeats = async () => {
      setIsLoadingSeats(true);

      try {
        const data = await getShowtimeSeats(selectedShowtimeId, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setShowtimeSeats(data);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching showtime seats:", error);
        setSeatError("Cannot load room seats. Please try again.");
      } finally {
        if (!controller.signal.aborted) setIsLoadingSeats(false);
      }
    };

    fetchShowtimeSeats();

    return () => {
      controller.abort();
    };
  }, [selectedShowtimeId]);

  if (movieError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 text-white">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-bold">Không thể tải trang đặt vé</h1>
          <p className="mt-3 text-white/70">{movieError}</p>
          <button
            onClick={() => navigate("/movie")}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-[#4F46E5]"
          >
            Quay lại danh sách phim
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-b-2 border-t-2 border-yellow-500" />
          <p>Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  const canOpenPayment = !!selectedShowtime && !!activeSeatData && selectedSeat.length > 0;
  const selectedShowtimeText = formatShowtimeText(selectedShowtime);
  const selectedRoomName =
    activeSeatData?.roomName ||
    selectedShowtime?.roomName ||
    selectedShowtime?.screenName ||
    selectedShowtime?.room?.name ||
    "";
  const selectedScreenId =
    activeSeatData?.screenId || selectedShowtime?.screenId || "";
  const selectedCinemaName =
    activeSeatData?.cinemaName || selectedShowtime?.cinema?.name || "";
  const selectedCinemaId =
    activeSeatData?.cinemaId || selectedShowtime?.cinemaId || "";

  return (
    <>
      <div className="relative mx-auto max-w-7xl px-6 pb-12">
        <div className="relative flex min-h-[360px] items-center gap-10 overflow-hidden rounded-b-2xl bg-[#2a2e4382] px-6 py-10">
          {movie.backdrop_path && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="relative z-10 w-[230px] rounded-[30px] shadow-xl"
          />

          <div className="relative z-10 text-white">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-yellow-300/80">
              TicketFlix Booking
            </p>
            <h1 className="max-w-3xl text-4xl font-bold uppercase leading-tight">
              {movie.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full bg-white/10 px-4 py-2">
                Điểm{" "}
                {movie.vote_average?.toFixed?.(1) ||
                  movie.vote_average ||
                  "N/A"}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                {movie.runtime
                  ? `${movie.runtime} phút`
                  : "Chưa cập nhật thời lượng"}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-white/10 bg-[#111624]/90 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="mt-1 text-2xl font-bold">Chọn lịch chiếu</h2>
                </div>
                {isLoadingShowtimes && (
                  <span className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm text-yellow-200">
                    Loading showtimes...
                  </span>
                )}
              </div>

              {showtimeError ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                  {showtimeError}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {dateOptions.map((option) => {
                      const active = selectedDate === option.dateKey;

                      return (
                        <button
                          key={option.dateKey}
                          onClick={() => setSelectedDate(option.dateKey)}
                          className={`min-w-[120px] rounded-xl border px-4 py-3 text-left transition ${
                            active
                              ? "border-yellow-400 bg-yellow-400 text-black"
                              : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                          }`}
                        >
                          <span className="block text-xs font-semibold uppercase opacity-70">
                            {option.isToday ? "Hôm nay" : "Ngày"}
                          </span>
                          <span className="mt-1 block font-bold">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {isLoadingShowtimes && availableShowtimes.length === 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <ShowtimeSkeleton key={index} />
                      ))}
                    </div>
                  ) : availableShowtimes.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center text-white/65">
                      {showtimes.length === 0
                        ? "Hiện chưa có suất chiếu cho phim này"
                        : "Hiện chưa có suất chiếu cho ngày này"}
                    </div>
                  ) : (
                    <div>
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
                        Suất chiếu
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {availableShowtimes.map((showtime) => {
                          const disabled = showtime.status !== "ACTIVE";
                          const active = selectedShowtimeId === showtime.id;

                          return (
                            <button
                              key={showtime.id}
                              disabled={disabled}
                              onClick={() => setSelectedShowtimeId(showtime.id)}
                              className={`rounded-xl border p-4 text-left transition ${
                                active
                                  ? "border-yellow-400 bg-yellow-400 text-black"
                                  : disabled
                                    ? "cursor-not-allowed border-white/10 bg-gray-600/20 text-white/35"
                                    : "border-white/10 bg-white/5 text-white hover:border-yellow-400/60 hover:bg-white/10"
                              }`}
                            >
                              <span className="block text-xl font-bold">
                                {showtime.startTimeLabel}-
                                {showtime.endTimeLabel}
                              </span>
                              <span className="mt-2 block text-sm opacity-70">
                                {showtime.screenId || showtime.room?.screenId || "SCREEN"} /{" "}
                                {showtime.roomName || showtime.room?.name || showtime.screenName || "Room"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-[#242424] p-5">
              <div className="flex h-[110px] w-full items-center justify-center rounded-b-[60px] rounded-t-xl bg-gradient-to-b from-[#95a096] to-[#242424] shadow-[0_12px_30px_rgba(80,80,80,0.22)]">
                <span className="text-lg font-semibold uppercase tracking-[0.35em] text-white/90">
                  Screen
                </span>
              </div>

              <div className="mt-5 flex min-h-[420px] items-center justify-center gap-[30px] rounded-2xl bg-[#1e1e1e] p-5">
                {!selectedShowtime ? (
                  <div className="max-w-md text-center text-white/65">
                    <h3 className="text-xl font-bold text-white">
                      Choose a showtime first
                    </h3>
                    <p className="mt-2">
                      Seats will load after you choose a valid date and showtime.
                    </p>
                  </div>
                ) : isLoadingSeats ? (
                  <div className="text-center text-white/65">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-yellow-400" />
                    <p>Loading room layout...</p>
                  </div>
                ) : seatError ? (
                  <div className="max-w-md rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-100">
                    {seatError}
                  </div>
                ) : activeSeatData ? (
                  <>
                    <Seat
                      setSelectedSeat={setSelectedSeat}
                      selectedSeat={selectedSeat}
                      cinemaData={activeSeatData}
                    />
                    <div>
                      <LegendItems
                        border={false}
                        color="bg-red-500"
                        label="Đã chọn"
                      />
                      <LegendItems
                        border={false}
                        color="bg-gray-300"
                        label="Đã mua"
                      />
                      <LegendItems
                        border={true}
                        borderColor="border-green-500"
                        label="Thường"
                      />
                      <LegendItems
                        border={true}
                        borderColor="border-red-500"
                        label="VIP"
                      />
                      <LegendItems
                        color="bg-pink-500"
                        label="Sweet box"
                        border={false}
                      />
                    </div>
                  </>
                ) : (
                  <div className="max-w-md text-center text-white/65">
                    <h3 className="text-xl font-bold text-white">
                      Chọn suất chiếu trước
                    </h3>
                    <p className="mt-2">
                      Ghế sẽ mở sau khi bạn chọn ngày và suất chiếu hợp lệ.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="rounded-2xl bg-[#2a2e4382] p-6 text-white lg:sticky lg:top-5 lg:self-start">
            <h2
              className="line-clamp-3 text-3xl font-bold uppercase leading-snug"
              title={movie.title}
            >
              {movie.title}
            </h2>

            <div className="mt-6 space-y-4 text-base">
              <SummaryLine
                label="Phòng chiếu"
                value={selectedRoomName || "Chưa chọn"}
              />
              <SummaryLine
                label="Ngày chiếu"
                value={
                  selectedShowtime
                    ? formatFullDate(selectedShowtime.date)
                    : "Chưa chọn"
                }
              />
              <SummaryLine
                label="Suất chiếu"
                value={
                  selectedShowtime
                    ? `${selectedShowtime.startTimeLabel} - ${selectedShowtime.endTimeLabel}`
                    : "Chưa chọn"
                }
              />

              <div className="border-b border-white/20 pb-4">
                <p className="mb-2 font-semibold text-white/80">Ghế đã chọn</p>
                <div className="max-h-24 overflow-y-auto rounded-lg bg-white/10 p-2">
                  {selectedSeat.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeatDetails.map((seat) => (
                        <span
                          key={seat.seatCode}
                          className="rounded-md bg-white px-2 py-1 text-xs font-medium text-[#4F46E5]"
                        >
                          {seat.seatCode} - {seat.seatType}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/70">Chưa chọn</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xl font-bold">
                <p>Tổng tiền</p>
                <p className="text-yellow-300">{formatCurrency(totalPrice)}</p>
              </div>

              <div className="grid gap-4 pt-4">
                <button
                  className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-white transition hover:bg-white/20"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  Quay lại
                </button>
                <button
                  disabled={!canOpenPayment}
                  onClick={() => setIsPopupOpen(true)}
                  className={`rounded-xl px-6 py-3 font-semibold transition ${
                    canOpenPayment
                      ? "bg-white text-[#4F46E5] hover:scale-105 hover:shadow-lg"
                      : "cursor-not-allowed bg-gray-500/40 text-white/45"
                  }`}
                >
                  Thanh toán
                </button>
                {!selectedShowtime && (
                  <p className="text-center text-sm text-yellow-100/70">
                    Vui lòng chọn suất chiếu trước khi thanh toán.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <PaymentPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onConfirm={({ paymentMethod }) => {
          setIsPopupOpen(false);

          navigate("/payment", {
            state: {
              movieId: movie.id,
              movieTitle: movie.title,
              poster: movie.poster_path,
              showtimeId: selectedShowtime.id,
              cinemaName: selectedCinemaName,
              cinemaId: selectedCinemaId,
              screenId: selectedScreenId,
              roomName: selectedRoomName,
              showtime: selectedShowtimeText,
              showtimeDate: formatFullDate(selectedShowtime.date),
              showtimeTime: `${selectedShowtime.startTimeLabel} - ${selectedShowtime.endTimeLabel}`,
              selectedSeats: selectedSeat,
              seatDetails: selectedSeatDetails,
              totalPrice,
              paymentMethod,
            },
          });
        }}
        movieTitle={movie.title}
        cinemaName={selectedCinemaName}
        roomName={selectedRoomName}
        showtime={selectedShowtimeText}
        selectedSeats={selectedSeat}
        totalPrice={totalPrice}
      />
    </>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-4 border-b border-white/20 pb-3">
      <p className="font-semibold text-white/80">{label}</p>
      <p className="text-right">{value}</p>
    </div>
  );
}

function ShowtimeSkeleton() {
  return (
    <div className="h-[86px] animate-pulse rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="h-5 w-20 rounded bg-white/15" />
      <div className="mt-3 h-4 w-32 rounded bg-white/10" />
    </div>
  );
}
