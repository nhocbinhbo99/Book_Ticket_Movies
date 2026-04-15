import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// ───────────────────────────────────── helper
const createToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ───────────────────────────────────── LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || "",
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ───────────────────────────────────── SIGNUP
export const signupUser = async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải từ 6 ký tự trở lên" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName: fullName || "",
      phone: phone || "",
      role: "user",
    });

    await newUser.save();

    const token = createToken(newUser);

    return res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone || "",
        avatar: newUser.avatar,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ───────────────────────────────────── GOOGLE AUTH
export const googleAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Thiếu Google access token" });
    }

    // Lấy thông tin user từ Google userinfo endpoint
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!googleRes.ok) {
      return res.status(401).json({ message: "Access token Google không hợp lệ" });
    }

    const { sub: googleId, email, name, picture } = await googleRes.json();

    // Tìm user đã tồn tại theo googleId hoặc email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Cập nhật googleId + avatar nếu chưa có
      if (!user.googleId) user.googleId = googleId;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    } else {
      // Tạo user mới từ Google
      user = await User.create({
        email,
        googleId,
        fullName: name || "",
        avatar: picture || "",
        password: null,
        role: "user",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Đăng nhập Google thành công",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || "",
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ message: "Đăng nhập Google thất bại" });
  }
};


// ───────────────────────────────────── UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, avatar } = req.body;
    const userId = req.user.id; // từ protect middleware

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (phone    !== undefined) updateData.phone    = phone.trim();
    if (avatar   !== undefined) updateData.avatar   = avatar; // base64 hoặc URL

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    return res.status(200).json({
      message: "Cập nhật thành công",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || "",
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
