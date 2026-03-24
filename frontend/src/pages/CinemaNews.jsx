import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatVND(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}

export default function CinemaNews() {
  const [data, setData] = useState({ topMovies: [], news: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((json) => {
        // ensure sorted by rating (backend now returns rating)
        const top = (json.topMovies || []).sort((a, b) => b.rating - a.rating).slice(0, 3);
        setData({ topMovies: top, news: json.news || [] });
      })
      .catch((err) => console.error("Failed to load news:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Đang tải tin tức...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Tin điện ảnh</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top 3 phim có doanh thu cao</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.topMovies.map((m) => (
            <div key={m.id} className="bg-[#0f1724] rounded-lg p-4">
              <img src={m.poster} alt={m.title} className="w-full h-52 object-cover rounded" />
              <h3 className="mt-3 text-lg font-bold">{m.title}</h3>
              <p className="text-sm text-gray-300">Doanh thu: {formatVND(m.revenue)}</p>
              <button
                onClick={() => navigate(`/movie/${m.id}`)}
                className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tin tức</h2>
        <div className="space-y-4">
          {data.news.map((n) => (
            <div key={n.id} className="bg-[#0b1220] p-4 rounded">
              <h3 className="text-lg font-bold">{n.title}</h3>
              <p className="text-gray-300 mt-1">{n.excerpt}</p>
              {n.movieId && (
                <button
                  onClick={() => navigate(`/movie/${n.movieId}`)}
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
                >
                  Xem phim liên quan
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
