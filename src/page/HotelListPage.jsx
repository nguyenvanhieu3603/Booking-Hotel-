import React, { useState } from "react";
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

  const handleAmenityChange = (amenity) => {
    setAmenities({
      ...amenities,
      [amenity]: !amenities[amenity],
    });
  };

  const handleStarRatingChange = (rating) => {
    setStarRating(starRating === rating ? null : rating);
  };

  const convertToUSD = (priceInVND) => {
    const exchangeRate = 26000;
    return (priceInVND / exchangeRate).toFixed(2);
  };

  // Thêm nhiều dữ liệu khách sạn mẫu
  const hotels = [
    {
      id: "1",
      name: "Vinpearl Resort & Spa Hạ Long",
      location: "Hạ Long, Quảng Ninh",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
      price: 2990000,
      rating: 4.8,
      featured: true,
      amenities: ["WiFi Miễn Phí", "Hồ Bơi", "Spa", "Nhà Hàng", "Phòng Gym"],
      description: "Tận hưởng kỳ nghỉ xa hoa với tầm nhìn tuyệt đẹp ra vịnh Hạ Long. Resort 5 sao của chúng tôi mang đến trải nghiệm đẳng cấp cùng dịch vụ chu đáo."
    },
    {
      id: "2",
      name: "Mường Thanh Luxury Đà Nẵng",
      location: "Đà Nẵng",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      price: 1890000,
      rating: 4.5,
      discount: 15,
      amenities: ["Bãi Biển Riêng", "Hồ Bơi Vô Cực", "Spa", "Nhà Hàng", "Quầy Bar"],
      description: "Tọa lạc tại bãi biển Mỹ Khê xinh đẹp, khách sạn mang đến không gian nghỉ dưỡng sang trọng với tầm nhìn ra biển tuyệt đẹp."
    },
    {
      id: "3",
      name: "Rex Hotel Sài Gòn",
      location: "TP. Hồ Chí Minh",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      price: 2490000,
      rating: 4.6,
      amenities: ["WiFi Miễn Phí", "Quầy Bar", "Nhà Hàng", "Dịch Vụ Phòng", "Trung Tâm Thương Mại"],
      description: "Khách sạn 5 sao mang tính biểu tượng tại trung tâm Sài Gòn, kết hợp hoàn hảo giữa kiến trúc cổ điển và tiện nghi hiện đại."
    },
    {
      id: "4",
      name: "Hanoi La Siesta",
      location: "Hà Nội",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      price: 1690000,
      rating: 4.7,
      featured: true,
      amenities: ["WiFi Miễn Phí", "Spa", "Nhà Hàng", "Quầy Bar", "Xe Đưa Đón"],
      description: "Khách sạn boutique sang trọng trong khu phố cổ Hà Nội, mang đến không gian yên tĩnh giữa nhịp sống sôi động của thủ đô."
    },
    {
      id: "5",
      name: "Ana Mandara Huế",
      location: "Huế, Thừa Thiên Huế",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      price: 2190000,
      rating: 4.9,
      discount: 10,
      amenities: ["Hồ Bơi Riêng", "Spa", "Nhà Hàng", "Bar", "Dịch Vụ Tour"],
      description: "Resort ven sông Hương thơ mộng, là điểm đến hoàn hảo để khám phá vẻ đẹp cố đô với kiến trúc độc đáo và ẩm thực đặc sắc."
    },
    {
      id: "6",
      name: "Phú Quốc Vinpearl Resort",
      location: "Phú Quốc, Kiên Giang",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      price: 3290000,
      rating: 4.8,
      amenities: ["Bãi Biển Riêng", "Hồ Bơi", "Spa", "Nhà Hàng", "Casino"],
      description: "Thiên đường nghỉ dưỡng tại đảo ngọc với bãi biển riêng tuyệt đẹp, dịch vụ đẳng cấp 5 sao và nhiều hoạt động giải trí hấp dẫn."
    },
    {
      id: "7",
      name: "Premier Village Danang Resort",
      location: "Đà Nẵng",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1170&q=80",
      price: 3590000,
      rating: 4.9,
      featured: true,
      amenities: ["Bãi Biển Riêng", "Hồ Bơi", "Spa", "Nhà Hàng", "Bar"],
      description: "Khu nghỉ dưỡng cao cấp bên bờ biển Đà Nẵng, lý tưởng cho kỳ nghỉ gia đình và nhóm bạn."
    },
    {
      id: "8",
      name: "Alba Wellness Resort Huế",
      location: "Huế",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1170&q=80",
      price: 2090000,
      rating: 4.7,
      amenities: ["Suối Nước Nóng", "Spa", "Nhà Hàng", "Yoga", "Xe Đưa Đón"],
      description: "Trải nghiệm nghỉ dưỡng kết hợp chăm sóc sức khỏe tại Alba Wellness Resort với suối nước nóng tự nhiên."
    },
    {
      id: "9",
      name: "Fusion Suites Sài Gòn",
      location: "TP. Hồ Chí Minh",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1170&q=80",
      price: 1790000,
      rating: 4.4,
      discount: 5,
      amenities: ["WiFi Miễn Phí", "Spa", "Nhà Hàng", "Bar", "Dịch Vụ Phòng"],
      description: "Khách sạn hiện đại, trẻ trung tại trung tâm Sài Gòn, nổi bật với dịch vụ spa miễn phí mỗi ngày."
    },
    {
      id: "10",
      name: "Salinda Resort Phú Quốc",
      location: "Phú Quốc",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1170&q=80",
      price: 3990000,
      rating: 4.9,
      featured: true,
      amenities: ["Bãi Biển Riêng", "Hồ Bơi", "Spa", "Nhà Hàng", "Bar"],
      description: "Resort 5 sao bên bờ biển tuyệt đẹp, nổi bật với kiến trúc độc đáo và dịch vụ đẳng cấp."
    },
    {
      id: "11",
      name: "Hotel de la Coupole Sapa",
      location: "Sa Pa, Lào Cai",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1170&q=80",
      price: 2590000,
      rating: 4.8,
      amenities: ["Spa", "Hồ Bơi", "Nhà Hàng", "Bar", "View Núi"],
      description: "Khách sạn phong cách Pháp giữa lòng Sa Pa, view núi tuyệt đẹp, dịch vụ sang trọng."
    },
    {
      id: "12",
      name: "The Reverie Saigon",
      location: "TP. Hồ Chí Minh",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1170&q=80",
      price: 4990000,
      rating: 5.0,
      featured: true,
      amenities: ["WiFi Miễn Phí", "Spa", "Nhà Hàng", "Bar", "Dịch Vụ Xe Limousine"],
      description: "Khách sạn 6 sao đẳng cấp quốc tế, tọa lạc tại trung tâm Quận 1, Sài Gòn."
    },
    {
      id: "13",
      name: "Anantara Hội An Resort",
      location: "Hội An, Quảng Nam",
      image: "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=1170&q=80",
      price: 2890000,
      rating: 4.7,
      amenities: ["Hồ Bơi", "Spa", "Nhà Hàng", "Bar", "Xe Đạp Miễn Phí"],
      description: "Resort ven sông thơ mộng, gần phố cổ Hội An, lý tưởng cho kỳ nghỉ thư giãn."
    },
    {
      id: "14",
      name: "Melia Ba Vi Mountain Retreat",
      location: "Ba Vì, Hà Nội",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1170&q=80",
      price: 3190000,
      rating: 4.6,
      amenities: ["Spa", "Hồ Bơi", "Nhà Hàng", "Bar", "View Núi"],
      description: "Khu nghỉ dưỡng giữa thiên nhiên Ba Vì, không gian xanh mát và yên bình."
    },
    {
      id: "15",
      name: "InterContinental Danang Sun Peninsula Resort",
      location: "Đà Nẵng",
      image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=1170&q=80",
      price: 5990000,
      rating: 5.0,
      featured: true,
      amenities: ["Bãi Biển Riêng", "Hồ Bơi", "Spa", "Nhà Hàng", "Bar"],
      description: "Resort sang trọng bậc nhất Việt Nam, view biển tuyệt đẹp, dịch vụ đỉnh cao."
    },
    {
      id: "16",
      name: "Silk Path Grand Resort & Spa Sapa",
      location: "Sa Pa, Lào Cai",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1170&q=80",
      price: 2690000,
      rating: 4.5,
      amenities: ["Spa", "Hồ Bơi", "Nhà Hàng", "Bar", "View Núi"],
      description: "Resort phong cách châu Âu giữa Sa Pa, không gian sang trọng và tiện nghi."
    },
    // ...bạn có thể thêm nhiều hơn nếu muốn...
  ];

  // Pagination
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

  return (
    <div className="bg-gradient-to-br from-[#e0e7ff] to-[#f8fafc] min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto mt-12 px-4">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-[#003b95] drop-shadow">
          <FormattedMessage id="hotellist.find_ideal_hotel" defaultMessage="Tìm Khách Sạn Lý Tưởng" />
        </h1>
        <p className="text-gray-600 mb-8 text-center text-lg">
          <FormattedMessage id="hotellist.explore_hotels" defaultMessage="Khám phá và lọc danh sách khách sạn cao cấp của chúng tôi" />
        </p>

        {/* Search Form */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white rounded-3xl p-6 shadow-2xl mb-10 border border-[#e5e7eb]">
          <div className="flex items-center gap-2 border-r pr-4">
            <FaBed className="text-[#003b95]" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "homepage.where_to_go", defaultMessage: "Bạn muốn đến đâu?" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition"
              aria-label={intl.formatMessage({ id: "homepage.where_to_go", defaultMessage: "Bạn muốn đến đâu?" })}
            />
          </div>
          <div className="flex items-center gap-2 border-r pr-4">
            <FaCalendarAlt className="text-[#003b95]" />
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              placeholderText={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage: "Ngày nhận phòng" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition"
              minDate={new Date()}
              aria-label={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage: "Ngày nhận phòng" })}
            />
            <span className="text-gray-400">—</span>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              placeholderText={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage: "Ngày trả phòng" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition"
              minDate={checkInDate || new Date()}
              aria-label={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage: "Ngày trả phòng" })}
            />
          </div>
          <div className="flex items-center gap-2 border-r pr-4">
            <FaUser className="text-[#003b95]" />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm cursor-pointer focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02] transition"
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
            className="bg-gradient-to-r from-[#febb02] to-[#fbbf24] cursor-pointer text-white px-8 py-2 rounded-full font-bold hover:from-[#d89b00] hover:to-[#f59e42] shadow-lg transition-all text-lg"
            aria-label={intl.formatMessage({ id: "homepage.search", defaultMessage: "Tìm" })}
          >
            <FormattedMessage id="homepage.search" defaultMessage="Tìm" />
          </button>
        </div>

        {/* Filters and Hotel Listings */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#e5e7eb]">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#003b95]">
                <FaCheckCircle className="text-[#febb02]" />
                <FormattedMessage id="hotellist.filters" defaultMessage="Bộ Lọc" />
              </h2>

              {/* Price Range */}
              <div className="mb-6">
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label={intl.formatMessage({ id: "hotellist.price_range", defaultMessage: "Khoảng Giá" })}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0] * 100000)}</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1] * 100000)}+</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
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
                        className="h-4 w-4 text-[#febb02] border-gray-300 rounded focus:ring-[#febb02]"
                        aria-label={intl.formatMessage({ id: `hotellist.${amenity}`, defaultMessage: amenity })}
                      />
                      <label htmlFor={amenity} className="text-gray-700">
                        <FormattedMessage id={`hotellist.${amenity}`} defaultMessage={amenity.charAt(0).toUpperCase() + amenity.slice(1)} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">
                  <FormattedMessage id="hotellist.star_rating" defaultMessage="Xếp Hạng Sao" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleStarRatingChange(rating)}
                      className={`px-3 py-1 rounded-full border border-gray-300 text-gray-700 ${
                        starRating === rating ? "bg-[#febb02] text-white" : "bg-white hover:bg-[#d89b00] hover:text-white"
                      } shadow-md transition`}
                      aria-label={intl.formatMessage(
                        { id: "hotellist.star_rating_button", defaultMessage: "{rating} Sao trở lên" },
                        { rating }
                      )}
                    >
                      {rating}+ <FormattedMessage id="hotellist.stars" defaultMessage="Sao" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="w-full bg-[#febb02] text-white px-4 py-2 rounded-full font-bold hover:bg-[#d89b00] shadow-md transition"
                aria-label={intl.formatMessage({ id: "hotellist.apply_filters", defaultMessage: "Áp Dụng Bộ Lọc" })}
              >
                <FormattedMessage id="hotellist.apply_filters" defaultMessage="Áp Dụng Bộ Lọc" />
              </button>
            </div>
          </div>

          {/* Hotel Listings */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="relative bg-white cursor-pointer shadow-xl rounded-2xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl border border-[#e5e7eb] group"
                >
                  {/* Featured/Discount badge */}
                  {hotel.featured && (
                    <span className="absolute top-4 left-4 bg-[#003b95] text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10">
                      <FormattedMessage id="hotellist.featured" defaultMessage="Nổi bật" />
                    </span>
                  )}
                  {hotel.discount && (
                    <span className="absolute top-4 right-4 bg-[#febb02] text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10 animate-bounce">
                      -{hotel.discount}%
                    </span>
                  )}
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-48 object-cover rounded-t-2xl group-hover:brightness-90 transition"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#003b95] truncate">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                      <FaMapMarkerAlt className="text-[#febb02]" />
                      <span>{hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(Math.round(hotel.rating))].map((_, i) => (
                        <FaStar key={i} className="text-[#febb02]" />
                      ))}
                      <span className="text-gray-600 ml-2 font-semibold">({hotel.rating})</span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm line-clamp-2 min-h-[40px]">{hotel.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {hotel.amenities.slice(0, 3).map((am, idx) => (
                        <span key={idx} className="bg-[#e0e7ff] text-[#003b95] text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                          {am}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="bg-[#febb02] text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                          +{hotel.amenities.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-end justify-between mt-6">
                      <p className="text-[#febb02] font-extrabold text-xl">
                        {intl.locale === "en"
                          ? `$${convertToUSD(hotel.price)}`
                          : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price)}`}
                        <span className="text-sm text-gray-500 font-normal ml-1">/đêm</span>
                      </p>
                      {/* <Link
                        to={`/hotel/${hotel.id}`}
                        className="bg-[#003b95] text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-[#febb02] hover:text-[#003b95] transition-all shadow"
                      >
                        <FormattedMessage id="hotellist.view_detail" defaultMessage="Xem chi tiết" />
                      </Link> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-10">
              <nav className="inline-flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-[#003b95] font-bold hover:bg-[#febb02] hover:text-white transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`px-3 cursor-pointer py-2 border-t border-b border-gray-300 bg-white font-bold ${currentPage === idx + 1 ? "bg-[#003b95] text-[#003b95]/50 " : "text-[#003b95] hover:bg-[#febb02] hover:text-white"} transition`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2  rounded-r-lg border border-gray-300 bg-white text-[#003b95] font-bold hover:bg-[#febb02] hover:text-white transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HotelListPage;