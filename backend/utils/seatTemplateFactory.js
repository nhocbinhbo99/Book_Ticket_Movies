// backend/src/utils/seatTemplateFactory.js
export function buildDefaultSeatTemplate() {
  const seats = [];

  const addRow = (row, count, type) => {
    for (let i = 1; i <= count; i++) {
      seats.push({ code: `${row}${i}`, type });
    }
  };

  addRow("A", 14, "NORMAL");
  addRow("B", 14, "NORMAL");

  addRow("C", 14, "VIP");
  addRow("D", 14, "VIP");
  addRow("E", 14, "VIP");
  addRow("F", 14, "VIP");
  addRow("G", 14, "VIP");

  // sweet box (ghế đôi)
  for (let i = 1; i <= 7; i++) seats.push({ code: `H${i}`, type: "SWEET_BOX" });

  return { name: "DEFAULT_TEMPLATE", seats };
}