import { useEffect, useState } from "react";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

function Banner() {
  const banners = [
    {
      image: banner1,
      title: "AVATAR",
      subtitle: "FIRE AND ASH",
      year: "2025"
    },
    {
      image: banner2,
      title: "SPIDER MAN",
      subtitle: "NO WAY HOME",
      year: "2024"
    },
    {
      image: banner3,
      title: "BATMAN",
      subtitle: "THE DARK",
      year: "2023"
    }
  ];

  const [current, setCurrent] = useState(0);

  // auto slide 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [ ]);

  const nextSlide = () => {
    setCurrent((current + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent(
      (current - 1 + banners.length) % banners.length
    );
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      
      {/* IMAGE */}
      <img
        src={banners[current].image}
        alt="banner"
        className="w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50 flex items-center">
        <div className="ml-16 text-white">
          <h1 className="text-5xl font-bold">
            {banners[current].title}
          </h1>

          <h2 className="text-4xl text-red-500 mt-2">
            {banners[current].subtitle}
          </h2>

          <p className="mt-4 text-gray-300">
            Movie • IMAX • {banners[current].year}
          </p>

          <button className="mt-6 border border-red-500 px-6 py-2 rounded-full hover:bg-red-500">
            ▶ ĐẶT VÉ
          </button>
        </div>
      </div>

      {/* BUTTON LEFT */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 text-white text-3xl"
      >
        ❮
      </button>

      {/* BUTTON RIGHT */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 text-white text-3xl"
      >
        ❯
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {banners.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === current
                ? "bg-yellow-400"
                : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Banner;