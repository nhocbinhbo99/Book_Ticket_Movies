import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

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

function App() {
  useEffect(() => {
    // Contact the backend so the backend can log a connection message to the server terminal.
    fetch("/api/tasks")
      .then(() => {
        // intentionally don't update UI; backend logs the message in the server terminal
      })
      .catch((err) => console.error("Backend connection failed:", err));

    // no role handling needed (single-role login)
  }, []);

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

        {/* Backend connection check removed from UI; server terminal will show the message. */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />

          {/* Movies */}
          <Route path="/movie" element={<Movie />} />
          <Route path="/news" element={<CinemaNews />} />
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