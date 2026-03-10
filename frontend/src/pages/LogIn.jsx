import { useState } from "react";
import { Link } from "react-router-dom";

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="bg-[#071226] text-white">
      <main className="w-full">
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#0b1630] via-[#0f1f4b] to-[#12305d] shadow-2xl">
            {/* LEFT SIDE */}
            <div className="relative min-h-[420px] lg:min-h-[560px]">
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
                alt="cinema"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#09101f]/90 via-[#0b1f52]/70 to-[#0c2f66]/40" />
              <div className="absolute inset-0 bg-black/30" />

              <div className="relative z-10 flex h-full items-center px-8 md:px-12">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-yellow-300 drop-shadow-lg">
                    Chào Mừng Trở Lại!
                  </h1>

                  <p className="mt-6 text-lg md:text-xl leading-8 text-yellow-100/90">
                    Khám phá thế giới điện ảnh đầy màu sắc cùng TicketFlix.
                  </p>

                  <p className="mt-3 text-lg md:text-xl leading-8 text-yellow-100/90">
                    Hàng ngàn bộ phim chất lượng cao đang chờ đón bạn!
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center bg-gradient-to-b from-[#17306b]/80 to-[#244d68]/80 px-5 py-8 md:px-8 lg:px-10">
              <div className="w-full max-w-md rounded-[28px] border border-yellow-500/60 bg-white/10 px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur-md md:px-8">
                <h2 className="text-center text-4xl font-extrabold text-white">
                  Đăng Nhập
                </h2>

                <p className="mt-2 text-center text-sm text-white/80">
                  Đăng nhập để tiếp tục đặt vé và theo dõi lịch chiếu
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="h-1 w-20 rounded-full bg-yellow-400" />
                </div>

                <form className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-white/90">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="duyen123@gmail.com"
                      className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/90">
                      Mật khẩu
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        className="w-full rounded-xl border border-white/20 bg-white/25 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/60 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 transition hover:text-yellow-400"
                      >
                        {showPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="flex items-center gap-2 text-white/80">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe((prev) => !prev)}
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

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-700 py-3 font-semibold text-white transition hover:bg-indigo-600"
                  >
                    Đăng Nhập
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-white/20" />
                    <span className="text-xs text-white/70">
                      Hoặc đăng nhập với
                    </span>
                    <div className="h-px flex-1 bg-white/20" />
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/10 py-3 font-medium text-white transition hover:bg-white/15"
                  >
                    <span className="text-2xl font-bold text-white">G</span>
                    <span>Google</span>
                  </button>

                  <p className="text-center text-sm text-white/75">
                    Chưa có tài khoản?{" "}
                    <Link
                      to="/signup"
                      className="font-semibold text-yellow-400 hover:underline"
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LogIn;
