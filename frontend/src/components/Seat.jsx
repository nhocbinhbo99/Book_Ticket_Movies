import { cn } from "../lib/utils";
export default function Seat({
  setSelectedSeat,
  selectedSeat,
  dispatch,
  cinemaData,
}) {
  const rows = cinemaData.rows;
  const seatPerRow = cinemaData.seatsPerRow;
  const coupleRows = cinemaData.coupleRows || [];
  const vipRows = cinemaData.vipRows || [];
  const soldSeats = cinemaData.soldSeats || [];
  const price = cinemaData.prices || 0;

  const getRowLabel = (i) => String.fromCharCode(65 + i);

  const getSeatPrice = (row) => {
    if (coupleRows.includes(row)) return price.couple;
    else if (vipRows.includes(row)) return price.vip;
    else return price.standard;
  };

  const handleSelectedSeat = (seatId) => {
    const seatPrice = getSeatPrice(seatId.charAt(0));
    setSelectedSeat((prev) => {
      if (prev.includes(seatId)) {
        dispatch({ type: "Decrease", payload: seatPrice });
        return prev.filter((s) => s !== seatId);
      } else {
        dispatch({ type: "Increase", payload: seatPrice });
        return [...prev, seatId];
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const rowLabel = getRowLabel(rowIndex);
          const isCoupleRow = coupleRows.includes(rowLabel);
          const isVipRow = vipRows.includes(rowLabel);

          const cols = seatPerRow;
          const colsTemp = isCoupleRow ? seatPerRow / 2 : seatPerRow;

          return (
            <div key={rowIndex} className="flex items-center">
              <div
                className={`grid grid-flow-col gap-2`}
                style={{
                  gridTemplateColumns: `repeat(${cols},35px)`,
                }}
              >
                {Array.from({ length: colsTemp }).map((_, seatIndex) => {
                  const seatNumber = seatIndex + 1;
                  const seatId = `${rowLabel}${seatNumber}`;
                  const isSoldSeat = soldSeats.includes(seatId);
                  const isSelected = selectedSeat.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      className={cn(
                        "rounded flex items-center justify-center text-sm text-black",
                        isCoupleRow ? "col-span-2 h-9" : "w-9 h-9",
                        isSoldSeat &&
                          "bg-gray-500 text-white cursor-not-allowed",
                        isSelected && "bg-red-500 text-white",
                        !isSoldSeat &&
                          isCoupleRow &&
                          !isSelected &&
                          "bg-pink-500",
                        !isSoldSeat &&
                          !isCoupleRow &&
                          !isSelected &&
                          "bg-white border-[3px] border-green-500",
                        !isSoldSeat &&
                          !isCoupleRow &&
                          isVipRow &&
                          "border-red-500",
                      )}
                      disabled={isSoldSeat}
                      onClick={() => handleSelectedSeat(seatId)}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
