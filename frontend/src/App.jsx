import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LightRays from "./components/LightRays";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Account from "./pages/Account";
import Movie from "./pages/Movie";
import TicketBooking from "./pages/TiketBooking";
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
          <Route path="/account" element={<Account />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/ticketbooking/:id" element={<TicketBooking />} />
          <Route path="/ticket" element={<Tickets />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/news" element={<CinemaNews />} />
          <Route path="/my-ticket-detail" element={<MyTicketDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
