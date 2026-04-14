import { User } from "../models/User.js";

// Login User (email + password)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email và mật khẩu là bắt buộc" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Kiểm tra password (trong thực tế nên hash password)
    if (user.password !== password) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Đăng ký User (email + password)
export const signupUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email và mật khẩu là bắt buộc" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const newUser = new User({
      email,
      password,
      fullName: fullName || "",
      role: "user",
    });

    await newUser.save();

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
