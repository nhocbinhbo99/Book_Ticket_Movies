import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    console.log("Signup data:", form);

    // sau này gọi API backend ở đây
  };

  return (
    <div className="bg-[#071226] text-white">
      <main className="w-full">
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-[#0b1630] via-[#0f1f4b] to-[#12305d] shadow-2xl">
            {/* LEFT SIDE */}
            <div className="relative min-h-[500px] lg:min-h-[700px]">
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
                alt="cinema"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#09101f]/90 via-[#0b1f52]/70 to-[#0c2f66]/40" />
              <div className="absolute inset-0 bg-black/30" />

              <div className="relative z-10 flex h-full items-center px-8 md:px-12">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300">
                    Chào Mừng Đến Với TicketFlix!
                  </h1>

                  <p className="mt-6 text-lg text-yellow-100/90">
                    Khám phá thế giới điện ảnh đầy màu sắc cùng TicketFlix.
                  </p>

                  <p className="mt-3 text-lg text-yellow-100/90">
                    Hàng ngàn bộ phim chất lượng cao đang chờ đón bạn!
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center px-5 py-10 bg-gradient-to-b from-[#17306b]/80 to-[#244d68]/80">
              <div className="w-full max-w-md rounded-[28px] border border-yellow-500/60 bg-white/10 backdrop-blur-md px-6 py-8">
                <h2 className="text-center text-4xl font-extrabold">Đăng Ký</h2>

                <p className="mt-2 text-center text-sm text-white/80">
                  Tạo tài khoản mới để bắt đầu
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full rounded-xl bg-white/25 px-4 py-3 text-white"
                  />

                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl bg-white/25 px-4 py-3 text-white"
                  />

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="Số điện thoại"
                    className="w-full rounded-xl bg-white/25 px-4 py-3 text-white"
                  />

                  {/* PASSWORD */}
                  <div className="relative">
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      className="w-full rounded-xl bg-white/25 px-4 py-3 text-white"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3"
                    >
                      👁
                    </button>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu"
                      className="w-full rounded-xl bg-white/25 px-4 py-3 text-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-3"
                    >
                      👁
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-700 py-3 font-semibold hover:bg-indigo-600"
                  >
                    Tạo Tài Khoản
                  </button>

                  <p className="text-center text-sm text-white/75">
                    Đã có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="text-yellow-400 hover:underline"
                    >
                      Đăng nhập ngay
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

export default Signup;
