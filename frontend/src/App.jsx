import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LightRays from "./components/LightRays";

import Home from "./pages/Home";
import Movie from "./pages/Movie";
import MovieDetail from "./pages/MovieDetail";
import TicketBooking from "./pages/TiketBooking";
import Account from "./pages/Account "; // bỏ dấu cách ở cuối

function App() {
  const [backendMsg, setBackendMsg] = useState("Đang kiểm tra kết nối backend...");

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.text())
      .then((text) => setBackendMsg("Kết nối OK: " + text))
      .catch((err) => setBackendMsg("Kết nối FAIL: " + err.message));
  }, []);

  return (
    <BrowserRouter>
      <div className="relative z-10 min-h-screen text-white bg-black">
        {/* Background Light Effect */}. 
        <div className="fixed inset-0 z-0 pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.6}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
          />
        </div>

        <Header />

        {/* Hiển thị trạng thái kết nối backend */}
        <div className="relative z-20 px-4 py-2 text-sm">
          {backendMsg}
        </div>

        <Routes>
          <Route path="/" element={<Home />} />

          {/* Movies */}
          <Route path="/movie" element={<Movie />} />
          <Route path="/movie/:id" element={<MovieDetail />} />

          {/* Booking */}
          <Route path="/movie/ticketbooking/:id" element={<TicketBooking />} />

          {/* Account */}
          <Route path="/account" element={<Account />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;