import crypto from "crypto";
import axios from "axios";
import Booking from "../models/Booking.js";
import Ticket from "../models/Ticket.js";

const PARTNER_CODE = process.env.MOMO_PARTNER_CODE || "MOMO";
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
const SECRET_KEY = process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const ENDPOINT =
  process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
const IPN_URL =
  process.env.MOMO_IPN_URL || "http://localhost:5001/api/payment/momo-callback";
const REDIRECT_URL =
  process.env.MOMO_REDIRECT_URL || "http://localhost:5173/payment-result";

function buildRawSignature(params) {
  const { accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType } = params;
  return [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
  ].join("&");
}

const SEAT_TYPE_MAP = { VIP: "VIP", couple: "COUPLE" };

function normalizeSeatType(seatType) {
  return SEAT_TYPE_MAP[seatType] || "NORMAL";
}

function createHmacSignature(rawSignature) {
  return crypto.createHmac("sha256", SECRET_KEY).update(rawSignature).digest("hex");
}

/** Generate a unique orderId with a random suffix to avoid collisions */
function generateOrderId() {
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${PARTNER_CODE}${Date.now()}${randomPart}`;
}

/** Sanitize orderId: only allow alphanumeric chars matching MoMo orderId format */
function sanitizeString(value, maxLength = 100) {
  return String(value || "").replace(/[^A-Za-z0-9]/g, "").slice(0, maxLength);
}

export const createMomoOrder = async (req, res) => {
  try {
    const {
      showtimeId,
      movieTitle,
      cinemaId,
      cinemaName,
      screenId,
      roomName,
      selectedSeats = [],
      seats = [],
      totalPrice,
      paymentMethod,
      customerName,
      email,
      phone,
    } = req.body || {};

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }

    const orderId = generateOrderId();
    const requestId = orderId;
    const amount = String(totalPrice);
    const orderInfo = `Đặt vé: ${movieTitle || "Movie"} - ${selectedSeats.join(", ")}`;
    const requestType = "payWithMethod";
    const extraData = Buffer.from(
      JSON.stringify({ showtimeId, seats, paymentMethod, customerName, email, phone }),
    ).toString("base64");

    const redirectUrl = `${REDIRECT_URL}?orderId=${orderId}`;
    const ipnUrl = IPN_URL;

    const rawSignature = buildRawSignature({
      accessKey: ACCESS_KEY,
      amount,
      extraData,
      ipnUrl,
      orderId,
      orderInfo,
      partnerCode: PARTNER_CODE,
      redirectUrl,
      requestId,
      requestType,
    });

    const signature = createHmacSignature(rawSignature);

    const requestBody = {
      partnerCode: PARTNER_CODE,
      partnerName: "BookingFlix",
      storeId: "BookingFlixStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      autoCapture: true,
      extraData,
      signature,
    };

    const momoResponse = await axios.post(ENDPOINT, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    const { resultCode, payUrl, message } = momoResponse.data;

    if (Number(resultCode) !== 0) {
      return res.status(400).json({
        message: `MoMo error: ${message}`,
        resultCode,
      });
    }

    // Create a PENDING booking so we can update it on callback
    const booking = await Booking.create({
      showtimeId,
      userId: req.user?._id || null,
      movieTitle: movieTitle || "",
      cinemaId: cinemaId || "",
      cinemaName: cinemaName || "",
      screenId: screenId || "",
      roomName: roomName || "",
      selectedSeats,
      seats,
      paymentMethod: paymentMethod || "momo",
      customerName: customerName || req.user?.fullName || "TicketFlix Guest",
      email: email || req.user?.email || "",
      phone: phone || req.user?.phone || "",
      status: "PENDING",
      totalAmount: Number(totalPrice),
      momoOrderId: orderId,
    });

    booking.orderCode = `TF${String(booking._id).slice(-8).toUpperCase()}`;
    await booking.save();

    return res.json({
      success: true,
      payUrl,
      orderId,
      bookingId: String(booking._id),
    });
  } catch (err) {
    console.error("createMomoOrder error:", err?.response?.data || err.message || err);
    return res.status(500).json({
      message: "Cannot create MoMo order. Please try again.",
      detail: err?.response?.data || err.message,
    });
  }
};

export const momoCallback = async (req, res) => {
  try {
    const { orderId, resultCode, transId, message, signature: momoSignature } = req.body || {};

    console.log("MoMo IPN callback:", { orderId, resultCode, transId, message });

    // Verify MoMo IPN signature to prevent spoofed callbacks
    if (momoSignature) {
      const {
        accessKey,
        amount,
        extraData,
        message: msg,
        orderInfo,
        orderType,
        partnerCode,
        payType,
        requestId,
        responseTime,
        resultCode: rc,
      } = req.body;

      const rawSignatureCheck = [
        `accessKey=${ACCESS_KEY}`,
        `amount=${amount}`,
        `extraData=${extraData}`,
        `message=${msg}`,
        `orderId=${orderId}`,
        `orderInfo=${orderInfo}`,
        `orderType=${orderType}`,
        `partnerCode=${partnerCode}`,
        `payType=${payType}`,
        `requestId=${requestId}`,
        `responseTime=${responseTime}`,
        `resultCode=${rc}`,
        `transId=${transId}`,
      ].join("&");

      const expectedSignature = createHmacSignature(rawSignatureCheck);
      if (expectedSignature !== momoSignature) {
        console.warn("MoMo IPN signature mismatch for orderId:", orderId);
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }
    }

    const safeOrderId = sanitizeString(orderId);
    const booking = await Booking.findOne({ momoOrderId: safeOrderId });

    if (!booking) {
      console.warn("Booking not found for MoMo orderId:", safeOrderId);
      return res.json({ success: false, message: "Booking not found" });
    }

    if (Number(resultCode) === 0) {
      // Payment successful
      booking.status = "PAID";
      booking.paymentStatus = "PAID";
      booking.transactionId = String(transId || "");
      await booking.save();

      // Create tickets
      const existingTickets = await Ticket.find({ bookingId: booking._id }).lean();
      if (existingTickets.length === 0) {
        await Ticket.insertMany(
          booking.seats.map((seat) => ({
            showtimeId: booking.showtimeId,
            bookingId: booking._id,
            seatCode: seat.seatCode,
            seatType: normalizeSeatType(seat.seatType),
            price: seat.price,
            status: "PAID",
          })),
          { ordered: false },
        );
      }
    } else {
      booking.status = "CANCELLED";
      booking.paymentStatus = "FAILED";
      await booking.save();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("momoCallback error:", err.message || err);
    return res.status(500).json({ message: "Callback processing error." });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const safeOrderId = sanitizeString(req.params.orderId);

    if (!safeOrderId) {
      return res.status(400).json({ message: "Invalid order id." });
    }

    const booking = await Booking.findOne({ momoOrderId: safeOrderId }).lean();

    if (!booking) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json({
      orderId: safeOrderId,
      bookingId: String(booking._id),
      orderCode: booking.orderCode,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      totalAmount: booking.totalAmount,
      movieTitle: booking.movieTitle,
      selectedSeats: booking.selectedSeats,
    });
  } catch (err) {
    console.error("checkPaymentStatus error:", err.message || err);
    return res.status(500).json({ message: "Cannot check payment status." });
  }
};

