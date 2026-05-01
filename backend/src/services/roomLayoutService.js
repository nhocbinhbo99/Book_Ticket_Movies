import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOM_LAYOUTS_PATH = path.resolve(__dirname, "../../data/roomLayouts.json");

let cachedLayouts = null;

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function cloneLayout(layout) {
  return layout ? JSON.parse(JSON.stringify(layout)) : null;
}

function readRoomLayoutFile() {
  if (cachedLayouts) return cachedLayouts;

  const raw = fs.readFileSync(ROOM_LAYOUTS_PATH, "utf8");
  const data = JSON.parse(raw);
  cachedLayouts = Array.isArray(data.rooms) ? data.rooms : [];

  return cachedLayouts;
}

export function getRoomLayouts() {
  return readRoomLayoutFile().map(cloneLayout);
}

export function getRoomLayoutByRoomName(roomName) {
  const key = normalizeText(roomName);
  if (!key) return null;

  return cloneLayout(
    readRoomLayoutFile().find((room) => normalizeText(room.roomName) === key),
  );
}

export function getRoomLayoutByScreenId(screenId) {
  const key = normalizeText(screenId);
  if (!key) return null;

  return cloneLayout(
    readRoomLayoutFile().find((room) => normalizeText(room.screenId) === key),
  );
}

export function getRoomLayoutForShowtime(showtime) {
  const room = showtime?.roomId || showtime?.room || null;
  const roomName = room?.name || showtime?.roomName || showtime?.screenName || "";
  const screenId = showtime?.screenId || "";

  return getRoomLayoutByScreenId(screenId) || getRoomLayoutByRoomName(roomName);
}

export function getRowLabels(rowCount = 0) {
  return Array.from({ length: Number(rowCount) || 0 }, (_, index) =>
    String.fromCharCode(65 + index),
  );
}

export function getSeatTypeForRow(layout, rowLabel) {
  if (!layout) return "STANDARD";
  if ((layout.coupleRows || []).includes(rowLabel)) return "COUPLE";
  if ((layout.vipRows || []).includes(rowLabel)) return "VIP";
  return "STANDARD";
}

export function getTicketSeatType(seatType) {
  if (seatType === "VIP") return "VIP";
  if (seatType === "COUPLE") return "SWEET_BOX";
  return "NORMAL";
}

export function getSeatTypeForCode(layout, seatCode) {
  const rowLabel = String(seatCode || "").trim().charAt(0).toUpperCase();
  return getSeatTypeForRow(layout, rowLabel);
}

export function getSeatPriceByType(layout, seatType) {
  const prices = layout?.prices || {};

  if (seatType === "VIP") return Number(prices.vip) || 0;
  if (seatType === "COUPLE") return Number(prices.couple) || 0;
  return Number(prices.standard) || 0;
}

export function getSeatPriceForCode(layout, seatCode) {
  return getSeatPriceByType(layout, getSeatTypeForCode(layout, seatCode));
}

export function getSeatCodesForLayout(layout) {
  if (!layout) return [];

  return getRowLabels(layout.rows).flatMap((rowLabel) =>
    Array.from({ length: Number(layout.seatsPerRow) || 0 }, (_, index) => `${rowLabel}${index + 1}`),
  );
}

export function serializeRoomLayoutForShowtime(layout, showtime) {
  if (!layout) return null;

  const cinema = showtime?.cinemaId || showtime?.roomId?.cinemaId || null;

  return {
    ...cloneLayout(layout),
    cinemaName: cinema?.name || layout.cinemaName,
  };
}
