import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import axios from "axios";

function ProvinceHotelsPage() {
  const { provinceName } = useParams();
  const backendUrl = "http://localhost/bookingBackend";
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage, setHotelsPerPage] = useState(6);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${backendUrl}/api/hotel/province`, { params: { province: provinceName } })
      .then((res) => setHotels(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [provinceName]);

  // Tính toán phân trang
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHotelsPerPageChange = (e) => {
    setHotelsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto mt-12 px-4">
        <h2 className="text-4xl font-extrabold text-[#003b95] text-center mb-10 mt-8 tracking-tight drop-shadow-lg">
          Danh sách khách sạn tại{" "}
          <span className="text-[#febb02]">{provinceName}</span>
        </h2>
        {loading && (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003b95]"></span>
          </div>
        )}
        {error && (
          <p className="text-center text-red-500 text-lg font-semibold">
            {error}
          </p>
        )}
        {!loading && !error && hotels.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            Không có khách sạn nào cho tỉnh này.
          </p>
        )}
        <div className="flex justify-end items-center mb-6 gap-2">
          <label
            htmlFor="hotelsPerPage"
            className="mr-2 text-gray-700 font-medium"
          >
            Hiển thị:
          </label>
          <select
            id="hotelsPerPage"
            value={hotelsPerPage}
            onChange={handleHotelsPerPageChange}
            className="border border-[#febb02] rounded px-3 py-1 focus:ring-2 focus:ring-[#febb02] focus:outline-none bg-white shadow-sm"
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
          <span className="ml-2 text-gray-500">khách sạn/trang</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentHotels.map((hotel) => (
            <Link
              to={`/home-list/${hotel.id}`}
              key={hotel.id}
              className="bg-white cursor-pointer shadow-xl rounded-2xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl flex flex-col border border-gray-100 hover:border-[#febb02] group"
            >
              <div className="relative">
                <img
                  src={
                    hotel.images && hotel.images[0]
                      ? `${backendUrl}/${hotel.images[0]}`
                      : "https://htmlburger.com/blog/wp-content/uploads/2021/07/The-Best-50-Website-Preloaders-Around-the-Web-Example-26.gif"
                  }
                  alt={hotel.name}
                  className="w-full h-56 object-cover rounded-t-2xl group-hover:brightness-90 transition"
                  onError={(e) => {
                    e.target.src = "https://htmlburger.com/blog/wp-content/uploads/2021/07/The-Best-50-Website-Preloaders-Around-the-Web-Example-26.gif";
                  }}
                />
                <span className="absolute top-3 right-3 bg-[#febb02] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {hotel.rating || 0} ★
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 truncate mb-1 group-hover:text-[#003b95] transition">
                  {hotel.name}
                </h3>
                <div className="text-gray-500 mt-1 text-sm truncate flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-[#febb02]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z" />
                  </svg>
                  {hotel.address}
                </div>
                <p className="text-gray-600 mt-2 text-sm line-clamp-2 min-h-[40px] flex-1">
                  {hotel.description || "Không có mô tả"}
                </p>
                <button className="mt-4 bg-[#febb02] text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-[#e0a800] transition self-end">
                  Xem chi tiết
                </button>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2 mb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-bold text-lg"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-full cursor-pointer font-bold text-lg transition-all ${
                  currentPage === i + 1
                    ? "bg-[#003b95] text-white shadow-lg scale-110"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-bold text-lg"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProvinceHotelsPage;
