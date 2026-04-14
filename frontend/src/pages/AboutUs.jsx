
function AboutUs() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-700 py-5 text-center">
    
        <h1 className="text-4xl font-bold mb-4">TicketFlix</h1>
        <p className="max-w-2xl mx-auto text-lg text-black">
          Nền tảng đặt vé xem phim trực tuyến hiện đại, mang đến trải nghiệm giải trí tiện lợi và an toàn cho mọi tín đồ điện ảnh.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-300 leading-7">
            TicketFlix ra đời với mục tiêu giúp khán giả dễ dàng tiếp cận lịch chiếu phim, đặt vé nhanh chóng chỉ trong vài bước. 
            Chúng tôi mong muốn mang đến sự tiện lợi, hiện đại và trải nghiệm điện ảnh trọn vẹn cho cộng đồng yêu phim.
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Giá trị cốt lõi</h3>
          <ul className="space-y-2 text-gray-300">
            <li>🎬 Trải nghiệm điện ảnh tuyệt vời</li>
            <li>⚡ Đặt vé nhanh chóng, tiện lợi</li>
            <li>🔒 An toàn và bảo mật thông tin</li>
            <li>🤝 Kết nối cộng đồng yêu phim</li>
          </ul>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">Đội ngũ của chúng tôi</h2>
          <p className="text-gray-300 max-w-3xl mx-auto mb-10">
            TicketFlix được xây dựng bởi những con người trẻ trung, sáng tạo và đam mê điện ảnh. 
            Chúng tôi luôn nỗ lực để mang đến dịch vụ tốt nhất cho khách hàng.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold">Đàm Thái An</h3>
              <p className="text-sm text-gray-400">23710201</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold">Trần Quốc Anh</h3>
              <p className="text-sm text-gray-400">23710221</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold">Hoàng Phước Thành Công</h3>
              <p className="text-sm text-gray-400">Dev</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold">Tiến Đạt</h3>
              <p className="text-sm text-gray-400">Dev</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Liên hệ với chúng tôi</h2>
        <p className="text-gray-300 mb-6">
          📍 12 Nguyễn Văn Bảo, Quận Gò Vấp, TP.HCM <br />
          📧 Email: support@ticketflix.com
        </p>
        <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">
          Gửi tin nhắn
        </button>
      </div>
    </div>
  );
}

export default AboutUs;
