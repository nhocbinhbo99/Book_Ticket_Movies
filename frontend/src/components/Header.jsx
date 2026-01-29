import logo from "../assets/logo.png"
function Header() {
  return (
    <header className="w-full bg-[#1f1f1f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* LOGO */}
       <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
         <span className="text-xl font-semibold tracking-wide"> 
        TicketFlix
         </span>
       </div>  

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#" className="hover:text-yellow-400">Trang chủ</a>
          <a href="#" className="hover:text-yellow-400">Đặt vé</a>
          <a href="#" className="hover:text-yellow-400">Lịch chiếu</a>
          <a href="#" className="hover:text-yellow-400">Vé</a>
          <a href="#" className="hover:text-yellow-400">Phim</a>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          
          {/* SEARCH */}
          <div className="hidden md:flex items-center bg-[#2a2a2a] rounded-full px-3 py-1">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="bg-transparent outline-none text-sm w-28"
            />
            <span className="ml-2 text-gray-400">🔍</span>
          </div>

          <span className="text-sm cursor-pointer hover:text-yellow-400">
            VIE
          </span>

          <span className="text-sm cursor-pointer hover:text-yellow-400">
            Hỗ trợ
          </span>

          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
            👤
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;