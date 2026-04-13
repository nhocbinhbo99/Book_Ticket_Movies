import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
function Header() {
  return (
    <header className="w-full bg-[#1f1f1f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO + BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-semibold tracking-wide hover:text-yellow-400">
            TicketFlix
          </span>
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-yellow-400 transition">
            Trang chủ
          </Link>

          {/* mấy cái dưới có thể tạo page sau */}
          <Link to="/" className="hover:text-yellow-400 transition">
            Đặt vé
          </Link>

          <Link to="/" className="hover:text-yellow-400 transition">
            Lịch chiếu
          </Link>

          <Link to="/" className="hover:text-yellow-400 transition">
            Vé
          </Link>

          <Link to="/" className="hover:text-yellow-400 transition">
            Phim
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="hidden md:flex items-center bg-[#2a2a2a] rounded-full px-3 py-1 shadow-inner">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="bg-transparent outline-none text-sm w-28 placeholder-gray-400"
            />
            <span className="ml-2 text-gray-400">🔍</span>
          </div>

          {/* LANGUAGE */}
          <span className="text-sm cursor-pointer hover:text-yellow-400 transition">
            VIE
          </span>

          {/* SUPPORT */}
          <span className="text-sm cursor-pointer hover:text-yellow-400 transition">
            Hỗ trợ
          </span>

          {/* AVATAR */}
          <Link
            to="/account"
            className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition"
          >
            👤
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
