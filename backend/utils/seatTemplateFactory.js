// backend/src/utils/seatTemplateFactory.js
function getTicketSeatType(layout, rowLabel) {
  if ((layout.coupleRows || []).includes(rowLabel)) return "SWEET_BOX";
  if ((layout.vipRows || []).includes(rowLabel)) return "VIP";
  return "NORMAL";
}

export function buildSeatTemplateFromLayout(layout, name = "DEFAULT_TEMPLATE") {
  const seats = [];
  const rowCount = Number(layout?.rows) || 0;
  const seatsPerRow = Number(layout?.seatsPerRow) || 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowLabel = String.fromCharCode(65 + rowIndex);
    const type = getTicketSeatType(layout, rowLabel);

    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber += 1) {
      seats.push({ code: `${rowLabel}${seatNumber}`, type });
    }
  }

  return { name, seats };
}

export function buildDefaultSeatTemplate(layout) {
  return buildSeatTemplateFromLayout(
    layout || {
      rows: 0,
      seatsPerRow: 0,
      vipRows: [],
      coupleRows: [],
    },
  );
}
