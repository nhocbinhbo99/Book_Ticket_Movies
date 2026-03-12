import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TicketBooking from "./pages/TiketBooking";
import MovieDetail from "./pages/MovieDetail";
import LightRays from "./components/LightRays";
import Account from "./pages/Account ";
import Movie from "./pages/Moive";
function App() {
  return (
    <BrowserRouter>
      <div className="relative z-10  min-h-screen text-white bg-black">
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
          <Route path="/movie" element={<Movie />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/movie/:id" element={<MovieDetail />} />
          
          <Route path="/movie/ticketbooking/:id" element={<TicketBooking />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
