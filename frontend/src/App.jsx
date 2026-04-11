import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LightRays from "./components/LightRays";

import Home from "./pages/Home";
import Movie from "./pages/Movie";
import MovieDetail from "./pages/MovieDetail";
import TicketBooking from "./pages/TiketBooking";
import Account from "./pages/Account "; // bỏ dấu cách ở cuối
import LogIn from "./pages/LogIn";
import CinemaNews from "./pages/CinemaNews";
import Tickets from "./pages/Tickets";
import AboutUs from "./pages/AboutUs";
import PaymentPage from "./pages/PaymentPage";
import MyTicketDetail from "./pages/MyTicketDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="relative z-10 min-h-screen text-white bg-black">
        {/* Background Light Effect */}
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/news" element={<CinemaNews />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/ticketbooking/:id" element={<TicketBooking />} />
          <Route path="/account" element={<Account />} />
          <Route path="/ticket" element={<Tickets />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/my-ticket-detail" element={<MyTicketDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
