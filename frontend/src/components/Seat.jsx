import { cn } from "../lib/utils";

function getRowLabel(index) {
  return String.fromCharCode(65 + index);
}

function getSeatType(rowLabel, cinemaData) {
  if ((cinemaData.coupleRows || []).includes(rowLabel)) return "COUPLE";
  if ((cinemaData.vipRows || []).includes(rowLabel)) return "VIP";
  return "STANDARD";
}

function getSeatPrice(rowLabel, cinemaData) {
  const prices = cinemaData.prices || {};
  const seatType = getSeatType(rowLabel, cinemaData);

  if (seatType === "COUPLE") return prices.couple || 0;
  if (seatType === "VIP") return prices.vip || 0;
  return prices.standard || 0;
}

export default function Seat({ setSelectedSeat, selectedSeat, cinemaData }) {
  const rows = Number(cinemaData?.rows) || 0;
  const seatPerRow = Number(cinemaData?.seatsPerRow) || 0;
  const soldSeatSet = new Set(cinemaData?.soldSeats || []);

  const handleSelectedSeat = (seatId) => {
    if (soldSeatSet.has(seatId)) return;

    setSelectedSeat((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId],
    );
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="mx-auto flex w-max flex-col gap-3">
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const rowLabel = getRowLabel(rowIndex);

          return (
            <div key={rowLabel} className="grid grid-cols-[28px_1fr_28px] items-center gap-3">
              <span className="text-center text-sm font-semibold text-white/60">
                {rowLabel}
              </span>

              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${seatPerRow}, 40px)`,
                }}
              >
                {Array.from({ length: seatPerRow }).map((__, seatIndex) => {
                  const seatNumber = seatIndex + 1;
                  const seatId = `${rowLabel}${seatNumber}`;
                  const seatType = getSeatType(rowLabel, cinemaData);
                  const isSoldSeat = soldSeatSet.has(seatId);
                  const isSelected = selectedSeat.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded text-[11px] font-semibold transition",
                        isSoldSeat && "cursor-not-allowed bg-gray-500 text-white opacity-70",
                        isSelected && "bg-red-500 text-white shadow-[0_0_0_2px_rgba(248,113,113,0.35)]",
                        !isSoldSeat &&
                          !isSelected &&
                          seatType === "STANDARD" &&
                          "border-2 border-green-500 bg-white text-black hover:bg-green-100",
                        !isSoldSeat &&
                          !isSelected &&
                          seatType === "VIP" &&
                          "border-2 border-red-500 bg-white text-black hover:bg-red-100",
                        !isSoldSeat &&
                          !isSelected &&
                          seatType === "COUPLE" &&
                          "bg-pink-500 text-white hover:bg-pink-400",
                      )}
                      disabled={isSoldSeat}
                      title={`${seatId} - ${seatType} - ${getSeatPrice(rowLabel, cinemaData).toLocaleString("vi-VN")}d`}
                      onClick={() => handleSelectedSeat(seatId)}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>

              <span className="text-center text-sm font-semibold text-white/60">
                {rowLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
