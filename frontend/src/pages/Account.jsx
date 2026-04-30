import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { loginUser, signupUser, googleAuthApi } from "../services/auth";

function Account() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isLogin = mode === "login";

  // ─── Google Login ──────────────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError("");
      try {
        // Lấy ID token từ credential
        const result = await googleAuthApi(tokenResponse.access_token);

        if (!result?.token || !result?.user) {
          throw new Error("Server did not return a valid Google login token");
        }

        auth.login(result.user, result.token);
        navigate("/");
      } catch (err) {
        setError(err.message || "Đăng nhập Google thất bại");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => setError("Đăng nhập Google bị huỷ hoặc thất bại"),
    flow: "implicit",
  });

  const resetFields = () => {
    setFullName(""); setPhone(""); setEmail("");
    setPassword(""); setConfirmPassword("");
    setError(""); setAgree(false);
  };

  const switchMode = (m) => {
    setMode(m);
    resetFields();
    setSuccessMsg("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ─── Validate ──────────────────────────────────────────────
  const validate = () => {
    if (!email.trim()) return "Vui lòng nhập email";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email không hợp lệ";
    if (!password) return "Vui lòng nhập mật khẩu";
    if (password.length < 6) return "Mật khẩu phải từ 6 ký tự";
    if (!isLogin) {
      if (!fullName.trim()) return "Vui lòng nhập họ và tên";
      if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp";
      if (!agree) return "Bạn cần đồng ý với điều khoản dịch vụ";
    }
    return null;
  };

  // ─── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    try {
      if (isLogin) {
        // ── ĐĂNG NHẬP ───────────────────────────────────────
        const result = await loginUser(email, password);

        if (!result?.token || !result?.user) {
          throw new Error("Phản hồi không hợp lệ từ server");
        }

        auth.login(result.user, result.token);
        navigate("/");

      } else {
        // ── ĐĂNG KÝ → chuyển sang tab login ─────────────────
        await signupUser(email, password, fullName, phone);

        // Reset và chuyển sang tab đăng nhập
        resetFields();
        setEmail(email);        // giữ lại email để user khỏi nhập lại
        setMode("login");
        setError("");
        // Hiển thị thông báo thành công (dùng error state với màu xanh — xử lý ở UI)
        setSuccessMsg("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
      }
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-[#071226] text-white">
      <main className="w-full">
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-4">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#0b1630] via-[#0f1f4b] to-[#12305d] shadow-2xl">
            {/* background glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_30%)]" />
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* ───── LEFT — Billboard ───── */}
              <motion.div layout className="relative min-h-[480px] lg:min-h-[620px]">
                <img
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
                  alt="cinema"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#09101f]/90 via-[#0b1f52]/70 to-[#0c2f66]/40" />
                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-10 flex h-full items-center px-8 md:px-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.35 }}
                      className="max-w-xl"
                    >
                      <p className="mb-3 text-sm uppercase tracking-[0.25em] text-yellow-300/80">
                        TicketFlix
                      </p>
                      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-yellow-300 drop-shadow-lg">
                        {isLogin ? "Chào Mừng Trở Lại!" : "Sẵn Sàng Cho Suất Chiếu Tiếp Theo?"}
                      </h1>
                      <p className="mt-6 text-lg md:text-xl leading-8 text-yellow-100/90">
                        {isLogin
                          ? "Đăng nhập để đặt vé nhanh hơn, theo dõi lịch chiếu và lưu thông tin tài khoản của bạn."
                          : "Tạo tài khoản để khám phá thế giới điện ảnh và nhận trải nghiệm đặt vé tiện lợi hơn."}
                      </p>
                      <p className="mt-3 text-lg md:text-xl leading-8 text-yellow-100/90">
                        Hàng ngàn bộ phim chất lượng cao đang chờ đón bạn!
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ───── RIGHT — Form ───── */}
              <div className="flex items-center justify-center bg-gradient-to-b from-[#17306b]/80 to-[#244d68]/80 px-5 py-8 md:px-8 lg:px-10">
                <motion.div
                  layout
                  className="w-full max-w-md rounded-[28px] border border-yellow-500/60 bg-white/10 px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur-md md:px-8"
                >
                  {/* Tabs */}
                  <div className="mb-6 flex rounded-full bg-white/10 p-1">
                    {["login", "signup"].map((item) => (
                      <button
                        key={item}
                        onClick={() => switchMode(item)}
                        className="relative flex-1 rounded-full px-4 py-2 text-sm font-semibold"
                      >
                        {mode === item && (
                          <motion.div
                            layoutId="auth-tab"
                            className="absolute inset-0 rounded-full bg-indigo-600"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">
                          {item === "login" ? "Đăng nhập" : "Đăng ký"}
                        </span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, x: isLogin ? 24 : -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isLogin ? -24 : 24 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-center text-4xl font-extrabold text-white">
                        {isLogin ? "Đăng Nhập" : "Đăng Ký"}
                      </h2>
                      <p className="mt-2 text-center text-sm text-white/80">
                        {isLogin
                          ? "Đăng nhập để tiếp tục đặt vé và theo dõi lịch chiếu"
                          : "Tạo tài khoản mới để bắt đầu"}
                      </p>
                      <div className="mt-4 flex justify-center">
                        <div className="h-1 w-20 rounded-full bg-yellow-400" />
                      </div>

                      {/* Error message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-3 text-sm text-red-300"
                        >
                          ⚠️ {error}
                        </motion.div>
                      )}

                      {/* Success message — hiện sau đăng ký thành công */}
                      {successMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 rounded-xl border border-green-500/40 bg-green-500/15 px-4 py-3 text-sm text-green-300"
                        >
                          ✅ {successMsg}
                        </motion.div>
                      )}

                      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>

                        {/* Signup-only fields */}
                        {!isLogin && (
                          <>
                            <motion.input
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              type="text"
                              placeholder="Họ và tên"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60 focus:border-yellow-400 transition"
                            />
                            <motion.input
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              type="text"
                              placeholder="Số điện thoại"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60 focus:border-yellow-400 transition"
                            />
                          </>
                        )}

                        {/* Email */}
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60 focus:border-yellow-400 transition"
                        />

                        {/* Password */}
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/60 focus:border-yellow-400 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                          >
                            {showPassword ? "🙈" : "👁"}
                          </button>
                        </div>

                        {/* Confirm Password — signup only */}
                        {!isLogin && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                          >
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Xác nhận mật khẩu"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/60 focus:border-yellow-400 transition"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((p) => !p)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                            >
                              {showConfirmPassword ? "🙈" : "👁"}
                            </button>
                          </motion.div>
                        )}

                        {/* Remember / Agree */}
                        {isLogin ? (
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 rounded border-white/30 accent-yellow-400"
                              />
                              <span>Nhớ tài khoản</span>
                            </label>
                            <span className="text-yellow-400 cursor-not-allowed opacity-70">Quên mật khẩu?</span>
                          </div>
                        ) : (
                          <label className="flex items-start gap-3 pt-1 text-sm text-white/80 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={agree}
                              onChange={(e) => setAgree(e.target.checked)}
                              className="mt-1 h-4 w-4 rounded border-white/30 accent-yellow-400"
                            />
                            <span>
                              Tôi đồng ý với{" "}
                              <span className="text-yellow-400">điều khoản và dịch vụ</span>
                            </span>
                          </label>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full rounded-xl bg-indigo-700 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Đang xử lý...
                            </>
                          ) : (
                            isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"
                          )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 py-1">
                          <div className="h-px flex-1 bg-white/20" />
                          <span className="text-xs text-white/70">
                            {isLogin ? "Hoặc đăng nhập với" : "Hoặc đăng ký với"}
                          </span>
                          <div className="h-px flex-1 bg-white/20" />
                        </div>

                        {/* Google Button — hoạt động thật */}
                        <button
                          type="button"
                          onClick={() => googleLogin()}
                          disabled={isGoogleLoading}
                          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/10 py-3 font-medium text-white transition hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isGoogleLoading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              Tiếp tục với Google
                            </>
                          )}
                        </button>

                        {/* Switch mode */}
                        <p className="text-center text-sm text-white/75">
                          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                          <button
                            type="button"
                            onClick={() => switchMode(isLogin ? "signup" : "login")}
                            className="font-semibold text-yellow-400 hover:underline"
                          >
                            {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
                          </button>
                        </p>
                      </form>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Account;
