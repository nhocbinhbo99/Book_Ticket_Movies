import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: null,   // null cho tài khoản Google (không có password)
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    fullName: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: null,   // lưu Google sub ID
    },
    avatar: {
      type: String,
      default: "",     // lưu ảnh đại diện từ Google hoặc upload
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
