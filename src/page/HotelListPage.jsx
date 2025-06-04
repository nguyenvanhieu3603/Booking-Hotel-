import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle, FaBed, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Footer from "../component/Footer";
import Header from "../component/Header";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

function HotelListPage() {
  const intl = useIntl();
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [amenities, setAmenities] = useState({
    wifi: false,
    pool: false,
    spa: false,
    restaurant: false,
    fitness: false,
  });
  const [starRating, setStarRating] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://localhost/bookingBackend";

  const handleAmenityChange = (amenity) => {
    setAmenities({
      ...amenities,
      [amenity]: !amenities[amenity],
    });
  };

  const handleStarRatingChange = (rating) => {
    setStarRating(starRating === rating ? null : rating);
  };

  // const convertToUSD = (priceInVND) => {
  //   const exchangeRate = 26000;
  //   return (priceInVND / exchangeRate).toFixed(2);
  // };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/hotel/list`, {
          params: { limit: 15 },
        });
        console.log("Dữ liệu khách sạn:", response.data);
        setHotels(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khách sạn:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const hotelsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);
  const paginatedHotels = hotels.slice(
    (currentPage - 1) * hotelsPerPage,
    currentPage * hotelsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-[#f0f4ff] to-[#f9fafb] min-h-screen">
      <Header />
      <div className="container mx-auto mt-12 px-4">
        <h1 className="mt-6 text-4xl font-extrabold mb-2 text-center text-[#003b95] drop-shadow-lg tracking-tight">
          <FormattedMessage id="hotellist.find_ideal_hotel" defaultMessage="Tìm Khách Sạn Lý Tưởng" />
        </h1>
        <p className=" text-gray-600 mb-16 text-center text-lg">
          <FormattedMessage id="hotellist.explore_hotels" defaultMessage="Khám phá và lọc danh sách khách sạn cao cấp của chúng tôi" />
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 bg-white rounded-3xl p-8 shadow-2xl mb-12 border border-[#e5e7eb]">
          <div className="flex items-center gap-2 border-r pr-6">
            <FaBed className="text-[#003b95] text-xl" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "homepage.where_to_go", defaultMessage: "Bạn muốn đến đâu?" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition w-44"
              aria-label={intl.formatMessage({ id: "homepage.where_to_go", defaultMessage: "Bạn muốn đến đâu?" })}
            />
          </div>
          <div className="flex items-center gap-2 border-r pr-6">
            <FaCalendarAlt className="text-[#003b95] text-xl" />
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              placeholderText={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage: "Ngày nhận phòng" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition w-36"
              minDate={new Date()}
              aria-label={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage: "Ngày nhận phòng" })}
            />
            <span className="text-gray-400">—</span>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              placeholderText={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage: "Ngày trả phòng" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition w-36"
              minDate={checkInDate || new Date()}
              aria-label={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage: "Ngày trả phòng" })}
            />
          </div>
          <div className="flex items-center gap-2 border-r pr-6">
            <FaUser className="text-[#003b95] text-xl" />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="outline-none text-gray-700 bg-gray-100 rounded-xl px-4 py-2 shadow-sm cursor-pointer focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition"
              aria-label={intl.formatMessage({ id: "homepage.guests", defaultMessage: "Số lượng khách" })}
            >
              <option value={1}>
                <FormattedMessage id="homepage.one_guest" defaultMessage="1 Khách" />
              </option>
              <option value={2}>
                <FormattedMessage id="homepage.two_guests" defaultMessage="2 Khách" />
              </option>
              <option value={3}>
                <FormattedMessage id="homepage.three_guests" defaultMessage="3 Khách" />
              </option>
              <option value={4}>
                <FormattedMessage id="homepage.four_guests" defaultMessage="4 Khách" />
              </option>
              <option value={5}>
                <FormattedMessage id="homepage.five_plus_guests" defaultMessage="5+ Khách" />
              </option>
            </select>
          </div>
          <button
            className="bg-gradient-to-r from-[#febb02] to-[#fbbf24] cursor-pointer text-white px-10 py-2 rounded-full font-bold hover:from-[#d89b00] hover:to-[#f59e42] shadow-lg transition-all text-lg tracking-wide drop-shadow"
            aria-label={intl.formatMessage({ id: "homepage.search", defaultMessage: "Tìm" })}
          >
            <FormattedMessage id="homepage.search" defaultMessage="Tìm" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#e5e7eb] sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#003b95]">
                <FaCheckCircle className="text-[#febb02]" />
                <FormattedMessage id="hotellist.filters" defaultMessage="Bộ Lọc" />
              </h2>
              <div className="mb-8">
                <h3 className="font-medium mb-2">
                  <FormattedMessage id="hotellist.price_range" defaultMessage="Khoảng Giá" />
                </h3>
                <div className="px-2 mb-2">
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([50, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gradient-to-r from-[#febb02] to-[#fbbf24] rounded-lg appearance-none cursor-pointer accent-[#febb02]"
                    aria-label={intl.formatMessage({ id: "hotellist.price_range", defaultMessage: "Khoảng Giá" })}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 font-semibold">
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0] * 100000)}</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1] * 100000)}+</span>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="font-medium mb-2">
                  <FormattedMessage id="hotellist.amenities" defaultMessage="Tiện Nghi" />
                </h3>
                <div className="space-y-2">
                  {["wifi", "pool", "spa", "restaurant", "fitness"].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={amenities[amenity]}
                        onChange={() => handleAmenityChange(amenity)}
                        className="h-4 w-4 text-[#febb02] border-gray-300 rounded focus:ring-[#febb02] accent-[#febb02]"
                        aria-label={intl.formatMessage({ id: `hotellist.${amenity}`, defaultMessage: amenity })}
                      />
                      <label htmlFor={amenity} className="text-gray-700 capitalize">
                        <FormattedMessage id={`hotellist.${amenity}`} defaultMessage={amenity.charAt(0).toUpperCase() + amenity.slice(1)} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="font-medium mb-2">
                  <FormattedMessage id="hotellist.star_rating" defaultMessage="Xếp Hạng Sao" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleStarRatingChange(rating)}
                      className={`px-4 py-1 rounded-full border border-gray-300 text-gray-700 font-semibold shadow-sm transition-all
                        ${starRating === rating ? "bg-[#febb02] text-white scale-105" : "bg-white hover:bg-[#febb02] hover:text-white"}`}
                      aria-label={intl.formatMessage({ id: "hotellist.star_rating_button", defaultMessage: "{rating} Sao trở lên" }, { rating })}
                    >
                      {rating}+ <FormattedMessage id="hotellist.stars" defaultMessage="Sao" />
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-[#febb02] to-[#fbbf24] text-white px-4 py-2 rounded-full font-bold hover:from-[#d89b00] hover:to-[#f59e42] shadow-md transition text-lg"
                aria-label={intl.formatMessage({ id: "hotellist.apply_filters", defaultMessage: "Áp Dụng Bộ Lọc" })}
              >
                <FormattedMessage id="hotellist.apply_filters" defaultMessage="Áp Dụng Bộ Lọc" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {paginatedHotels.map((hotel) => (
                <Link
                  to={`/home-list/${hotel.id}`}
                  key={hotel.id}
                  className="relative bg-white cursor-pointer shadow-2xl rounded-3xl overflow-hidden transform transition-transform hover:scale-[1.04] hover:shadow-2xl border border-[#e5e7eb] group"
                >
                  <div className="relative">
                    <img
                      src={hotel.images[0] ? `${backendUrl}/${hotel.images[0]}` : "https://via.placeholder.com/300"}
                      alt={hotel.name}
                      className="w-full h-56 object-cover rounded-t-3xl group-hover:brightness-90 transition"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
                    />
                    <div className="absolute top-3 left-3 bg-[#003b95] text-white text-xs px-4 py-1 rounded-full shadow font-semibold z-10 flex items-center gap-1">
                      <FaStar className={hotel.rating ? "text-[#febb02]" : "text-gray-300"} />
                      {hotel.rating ? hotel.rating : 0}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-[220px]">
                    <h3 className="text-xl font-bold text-[#003b95] truncate mb-1">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                      <FaMapMarkerAlt className="text-[#febb02]" />
                      <span className="truncate">{hotel.address}</span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm line-clamp-2 min-h-[40px]">{hotel.description || "Không có mô tả"}</p>
                    <div className="flex items-end justify-between mt-auto pt-4">
                      {/* <div>
                        <span className="text-[#febb02] font-extrabold text-2xl drop-shadow">
                          {intl.locale === "en"
                            ? `$${convertToUSD(hotel.price || 0)}`
                            : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price || 0)}`}
                        </span>
                        <span className="text-xs text-gray-500 font-normal ml-1">/đêm</span>
                      </div> */}
                      <Link
                        to={`/home-list/${hotel.id}`}
                        className="bg-gradient-to-r from-[#003b95] to-[#2563eb] text-white px-5 py-2 rounded-full font-bold text-sm hover:from-[#febb02] hover:to-[#fbbf24] hover:text-[#003b95] transition-all shadow"
                      >
                        <FormattedMessage id="hotellist.view_detail" defaultMessage="Xem chi tiết" />
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Phân trang */}
            <div className="flex justify-center mt-12">
              <nav className="inline-flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-l-xl border border-gray-200 bg-white text-[#003b95] font-semibold hover:bg-[#febb02] hover:text-white transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  &larr;
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`px-4 py-2 border border-gray-200 font-semibold rounded-xl transition-colors ${currentPage === idx + 1 ? 'bg-[#003b95] text-white shadow-md scale-105' : 'bg-white text-[#003b95] hover:bg-[#febb02] hover:text-white'}`}>
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-r-xl border border-gray-200 bg-white text-[#003b95] font-semibold hover:bg-[#febb02] hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelListPage;