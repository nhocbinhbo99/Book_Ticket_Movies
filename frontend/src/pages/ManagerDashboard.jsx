import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (!storedUser || role !== "manager") {
      navigate("/login");
      return null;
    }

    return JSON.parse(storedUser);
  });
  const [loading] = useState(() => {
    const role = localStorage.getItem("role");
    return role !== "manager";
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    // Reload page để App.jsx cập nhật role state
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#071226]">
        <div className="text-white text-2xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#071226] text-white min-h-screen">
      <nav className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-6 py-4 shadow-lg">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yellow-300">🎬 TicketFlix Manager</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Đăng Xuất
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-indigo-700/50 border border-indigo-500/30 rounded-2xl p-8 mb-8">
          <h2 className="text-4xl font-bold text-yellow-300 mb-2">
            Chào mừng, {user?.fullName}!
          </h2>
          <p className="text-gray-300 text-lg">
            Mã nhân viên: <span className="text-yellow-400 font-semibold">{user?.employeeCode}</span>
          </p>
          <p className="text-gray-300 text-lg mt-2">
            Email: <span className="text-yellow-400 font-semibold">{user?.email}</span>
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Vai trò: <span className="text-green-400 font-semibold uppercase">{user?.role}</span>
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Quản lý phim */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Quản lý Phim</h3>
            <p className="text-gray-300 text-sm mb-4">Thêm, sửa, xoá phim</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition w-full">
              Vào
            </button>
          </div>

          {/* Card 2: Quản lý suất chiếu */}
          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-cyan-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">🎞️</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Suất Chiếu</h3>
            <p className="text-gray-300 text-sm mb-4">Quản lý lịch chiếu</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-semibold transition w-full">
              Vào
            </button>
          </div>

          {/* Card 3: Quản lý phòng chiếu */}
          <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Phòng Chiếu</h3>
            <p className="text-gray-300 text-sm mb-4">Quản lý phòng và ghế</p>
            <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold transition w-full">
              Vào
            </button>
          </div>

          {/* Card 4: Quản lý đặt vé */}
          <div className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 border border-rose-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-rose-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">🎟️</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Đặt Vé</h3>
            <p className="text-gray-300 text-sm mb-4">Xem và quản lý đơn đặt vé</p>
            <button className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg font-semibold transition w-full">
              Vào
            </button>
          </div>

          {/* Card 5: Báo cáo doanh thu */}
          <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Doanh Thu</h3>
            <p className="text-gray-300 text-sm mb-4">Xem báo cáo doanh thu</p>
            <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-semibold transition w-full">
              Vào
            </button>
          </div>

          {/* Card 6: Quản lý người dùng */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-indigo-500/20 transition cursor-pointer">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Người Dùng</h3>
            <p className="text-gray-300 text-sm mb-4">Quản lý tài khoản người dùng</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold transition w-full">
              Vào
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/30 rounded-xl p-6">
            <p className="text-gray-300 text-sm mb-2">Tổng Phim</p>
            <p className="text-4xl font-bold text-blue-400">24</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl p-6">
            <p className="text-gray-300 text-sm mb-2">Suất Chiếu Hôm Nay</p>
            <p className="text-4xl font-bold text-green-400">12</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6">
            <p className="text-gray-300 text-sm mb-2">Vé Đã Bán</p>
            <p className="text-4xl font-bold text-purple-400">342</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-gray-300 text-sm mb-2">Doanh Thu Hôm Nay</p>
            <p className="text-4xl font-bold text-yellow-400">25.5M</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;
