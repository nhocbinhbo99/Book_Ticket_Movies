import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";


function Account() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = mode === "login";

  return (
    <div className="bg-[#071226] text-white">

      <main className="w-full">
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-8 pb-4">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#0b1630] via-[#0f1f4b] to-[#12305d] shadow-2xl">
            {/* background glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_30%)]" />
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT */}
              <motion.div
                layout
                className="relative min-h-[480px] lg:min-h-[620px]"
              >
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
                        {isLogin
                          ? "Chào Mừng Trở Lại!"
                          : "Sẵn Sàng Cho Suất Chiếu Tiếp Theo?"}
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

              {/* RIGHT */}
              <div className="flex items-center justify-center bg-gradient-to-b from-[#17306b]/80 to-[#244d68]/80 px-5 py-8 md:px-8 lg:px-10">
                <motion.div
                  layout
                  className="w-full max-w-md rounded-[28px] border border-yellow-500/60 bg-white/10 px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur-md md:px-8"
                >
                  {/* tabs */}
                  <div className="mb-6 flex rounded-full bg-white/10 p-1">
                    {["login", "signup"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setMode(item)}
                        className="relative flex-1 rounded-full px-4 py-2 text-sm font-semibold"
                      >
                        {mode === item && (
                          <motion.div
                            layoutId="auth-tab"
                            className="absolute inset-0 rounded-full bg-indigo-600"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
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

                      <form className="mt-8 space-y-4">
                        {!isLogin && (
                          <>
                            <motion.input
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              type="text"
                              placeholder="Họ và tên"
                              className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60"
                            />
                            <motion.input
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              type="text"
                              placeholder="Số điện thoại"
                              className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60"
                            />
                          </>
                        )}

                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60"
                        />

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/60"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
                          >
                            {showPassword ? "🙈" : "👁"}
                          </button>
                        </div>

                        {!isLogin && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                          >
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Xác nhận mật khẩu"
                              className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/60"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
                            >
                              {showConfirmPassword ? "🙈" : "👁"}
                            </button>
                          </motion.div>
                        )}

                        {isLogin ? (
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <label className="flex items-center gap-2 text-white/80">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-white/30 accent-yellow-400"
                              />
                              <span>Nhớ tài khoản</span>
                            </label>

                            <Link
                              to="/forgot-password"
                              className="text-yellow-400 hover:underline"
                            >
                              Quên mật khẩu?
                            </Link>
                          </div>
                        ) : (
                          <label className="flex items-start gap-3 pt-1 text-sm text-white/80">
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4 rounded border-white/30 accent-yellow-400"
                            />
                            <span>
                              Tôi đồng ý với{" "}
                              <span className="text-yellow-400 hover:underline">
                                điều khoản và dịch vụ
                              </span>
                            </span>
                          </label>
                        )}

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-indigo-700 py-3 font-semibold text-white transition hover:bg-indigo-600"
                        >
                          {isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"}
                        </button>

                        <div className="flex items-center gap-3 py-1">
                          <div className="h-px flex-1 bg-white/20" />
                          <span className="text-xs text-white/70">
                            {isLogin
                              ? "Hoặc đăng nhập với"
                              : "Hoặc đăng ký với"}
                          </span>
                          <div className="h-px flex-1 bg-white/20" />
                        </div>

                        <button
                          type="button"
                          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/10 py-3 font-medium text-white transition hover:bg-white/15"
                        >
                          <span className="text-2xl font-bold text-white">
                            G
                          </span>
                          <span>Google</span>
                        </button>

                        <p className="text-center text-sm text-white/75">
                          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                          <button
                            type="button"
                            onClick={() =>
                              setMode(isLogin ? "signup" : "login")
                            }
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
