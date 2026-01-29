import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-300 mt-10 border-t border-yellow-500">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        
        {/* LOGO + DESC */}
        <div className="md:w-1/3">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="logo" className="w-16 h-16 object-contain" />
            <span className="text-2xl font-semibold text-white">
              TicketFlix
            </span>
          </div>
          <p className="text-sm leading-6 text-gray-400">
            AFlix là nền tảng đặt vé xem phim trực tuyến giúp bạn dễ dàng tìm
            kiếm lịch chiếu, lựa chọn rạp và đặt vé nhanh chóng chỉ trong vài
            bước. Chúng tôi mang đến trải nghiệm giải trí tiện lợi, hiện đại
            và an toàn cho mọi tín đồ điện ảnh.
          </p>
        </div>

        {/* COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
          
          {/* GIỚI THIỆU */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-3">
              Giới thiệu
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-yellow-400 cursor-pointer">About Us</li>
              <li className="hover:text-yellow-400 cursor-pointer">Blog</li>
              <li className="hover:text-yellow-400 cursor-pointer">Tuyển dụng</li>
            </ul>
          </div>

          {/* HỖ TRỢ */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-3">
              Hỗ trợ
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-yellow-400 cursor-pointer">Trung tâm trợ giúp</li>
              <li className="hover:text-yellow-400 cursor-pointer">Liên hệ</li>
              <li className="hover:text-yellow-400 cursor-pointer">Câu hỏi thường gặp</li>
            </ul>
          </div>

          {/* ĐIỀU KHOẢN */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-3">
              Điều khoản
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-yellow-400 cursor-pointer">Điều khoản sử dụng</li>
              <li className="hover:text-yellow-400 cursor-pointer">Chính sách bảo mật</li>
              <li className="hover:text-yellow-400 cursor-pointer">Quy định thanh toán</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SOCIAL + CONTACT */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          
          <div>
            <span className="text-yellow-400">Địa chỉ:</span> 12 Nguyễn Văn
            Bảo, Quận Gò Vấp, TP.HCM
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black cursor-pointer">
              f
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black cursor-pointer">
              X
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black cursor-pointer">
              ▶
            </div>
          </div>

          <div>
            <span className="text-yellow-400">Email:</span> adam@gmail.com
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-xs text-gray-500 pb-4">
        Ticketflix.com
      </div>
    </footer>
  );
}

export default Footer;