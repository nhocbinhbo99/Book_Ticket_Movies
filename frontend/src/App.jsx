import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TicketBooking from "./pages/TiketBooking";
import MovieDetail from "./pages/MovieDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen text-white">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/ticketbooking/:id" element={<TicketBooking />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
