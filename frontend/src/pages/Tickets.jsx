import { useState } from "react";

function Tickets() {

  const [tickets] = useState([]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-white">
      <h2 className="text-3xl font-bold mb-6"> Vé của tôi</h2>

      {tickets.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-lg text-center shadow-lg">
          <p className="text-lg text-gray-400">
            Bạn chưa mua vé nào. Khi đặt vé, chúng sẽ hiện ở đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{ticket.movieTitle}</h3>
              <p className="text-sm text-gray-300">Ngày chiếu: {ticket.date}</p>
              <p className="text-sm text-gray-300">Rạp: {ticket.cinema}</p>
              <p className="text-sm text-gray-300">Ghế: {ticket.seat}</p>
              <div className="mt-3 text-yellow-400 font-bold">
                Mã vé: {ticket.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tickets;
