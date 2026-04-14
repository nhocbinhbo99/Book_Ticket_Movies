// backend/src/utils/pricing.js
export function roundToNearest1000(vnd) {
  return Math.round(vnd / 1000) * 1000;
}

export function calcSeatPrice({ basePrice, seatType }) {
  let price = basePrice;

  if (seatType === "VIP") price = basePrice * 1.2;
  if (seatType === "SWEET_BOX") price = basePrice * 1.8;

  return roundToNearest1000(price);
}