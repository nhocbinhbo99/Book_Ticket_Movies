import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Seat from "../components/seat";
import LegendItems from "../components/LegendItems";
import cinemaData from "../services/cinemaData.json";

export default function TicketBooking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState([]);
  const reducer = (state, action) => {
    switch (action.type) {
      case "Decrease": {
        return state - action.payload;
      }
      case "Increase": {
        return state + action.payload;
      }
    }
  };
  const [totalPrice, dispatch] = useReducer(reducer, 0);
  useEffect(() => {
    console.log(totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`,
      );
      const data = await res.json();
      setMovie(data);
    };
    fetchMovie();
  }, [id]);

  if (!movie) {
    return <></>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="h-[400px] mx-auto px-6 relative bg-[#2a2e4382] rounded-b-2xl flex items-center gap-10">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-[230px] rounded-[30px] shadow-xl relative z-10"
          />
          <div className="text-white self-start pt-[60px]">
            <h1 className="text-4xl uppercase">{movie.title}</h1>
            <div className="grid grid-cols-1 gap-3 mt-4 text-white/80 text-sm w-[100px]">
              <span className="bg-white/10 px-1 py-1 rounded-full">
                ⭐ {movie.vote_average}
              </span>

              <span className="bg-white/10 px-1 py-1 rounded-full">
                ⏱ {movie.runtime} phút
              </span>
            </div>
          </div>
        </div>
        <div className="h-[700px] rounded-2xl mt-[10px] p-[20px] grid grid-cols-8 grid-rows-5 gap-5">
          <div className="col-span-6 row-span-5 grid grid-rows-5 gap-5">
            <div className="flex h-[110px] w-full items-center justify-center bg-gradient-to-b from-[#95a096] to-[#242424] rounded-t-xl rounded-b-[60px] shadow-[0_12px_30px_rgba(80,80,80,0.22)]">
              <span className="text-lg font-semibold uppercase tracking-[0.35em] text-white/90">
                Screen
              </span>
            </div>
            <div className=" rounded-2xl row-span-4 bg-[#242424] flex justify-center items-center gap-[30px]">
              <Seat
                setSelectedSeat={setSelectedSeat}
                selectedSeat={selectedSeat}
                dispatch={dispatch}
                cinemaData={cinemaData}
              />
              <div>
                {/* color, label, border, borderColor */}
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
            </div>
          </div>
          <div className="col-span-2 row-span-5 rounded-2xl bg-[#2a2e4382] p-6 text-white">
            <div className="uppercase">
              <h1 className="text-3xl font-bold leading-snug">{movie.title}</h1>
            </div>

            <div className="mt-6 space-y-4 text-lg">
              <div className="grid grid-cols-2 gap-4 border-b border-white/20 pb-3">
                <p className="font-semibold text-white/80">Rạp</p>
                <p>{cinemaData.cinemaName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-white/20 pb-3">
                <p className="font-semibold text-white/80">Mã rạp</p>
                <p>{cinemaData.cinemaId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-white/20 pb-3">
                <p className="font-semibold text-white/80">Phòng chiếu</p>
                <p>{cinemaData.screenId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-white/20 pb-3">
                <p className="font-semibold text-white/80">Xuất chiếu</p>
                <p></p>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 h-[55px]">
                <p className="font-semibold text-white/80">Ghế đã chọn</p>
                <div className="max-h-24 overflow-y-auto rounded-lg bg-white/10 p-2">
                  {selectedSeat.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeat.map((seat) => (
                        <span
                          key={seat}
                          className="rounded-md bg-white px-2 py-1 text-xs font-medium text-[#4F46E5]"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/70">Chưa chọn</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 text-xl font-bold">
                <p>Tổng tiền</p>
                <p>{totalPrice.toLocaleString("vi-VN")}đ</p>
              </div>
              <div className="mt-8 grid gap-4">
                <button
                  className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-white transition hover:bg-white/20"
                  onClick={() => {
                    navigate(`/movie/${movie.id}`);
                  }}
                >
                  Quay lại
                </button>
                <button className="rounded-xl bg-white px-6 py-3 font-semibold text-[#4F46E5] transition hover:scale-105 hover:shadow-lg">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
