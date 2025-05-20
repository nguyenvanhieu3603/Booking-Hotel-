
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

  // Dữ liệu khách sạn từ mockData
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
  ];

  return (

    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <Header />


      {/* Main Content */}
      <div className="container mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">
          <FormattedMessage id="hotellist.find_ideal_hotel" defaultMessage="Tìm Khách Sạn Lý Tưởng" />
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          <FormattedMessage id="hotellist.explore_hotels" defaultMessage="Khám phá và lọc danh sách khách sạn cao cấp của chúng tôi" />
        </p>

        {/* Search Form */}
        <div className="flex items-center justify-center gap-4 bg-white rounded-2xl p-4 shadow-md mb-8">
          <div className="flex items-center gap-2 border-r pr-4">
            <FaBed className="text-gray-500" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "homepage.where_to_go", defaultMessage: "Bạn muốn đến đâu?" })}
              className="outline-none text-gray-700"
              aria-label={intl.formatMessage({ id: "homepage.where_to_go", defaultMessage: "Bạn muốn đến đâu?" })}
            />
          </div>
          <div className="flex items-center gap-2 border-r pr-4">
            <FaCalendarAlt className="text-gray-500" />
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              placeholderText={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage: "Ngày nhận phòng" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02]"
              minDate={new Date()}
              aria-label={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage: "Ngày nhận phòng" })}
            />
            <span className="text-gray-500">—</span>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              placeholderText={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage: "Ngày trả phòng" })}
              className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02]"
              minDate={checkInDate || new Date()}
              aria-label={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage: "Ngày trả phòng" })}
            />
          </div>
          <div className="flex items-center gap-2 border-r pr-4">
            <FaUser className="text-gray-500" />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm cursor-pointer"
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
            className="bg-[#febb02] cursor-pointer text-white px-6 py-2 rounded-full font-bold hover:bg-[#d89b00] shadow-md transition"
            aria-label={intl.formatMessage({ id: "homepage.search", defaultMessage: "Tìm" })}
          >
            <FormattedMessage id="homepage.search" defaultMessage="Tìm" />
          </button>
        </div>

        {/* Filters and Hotel Listings */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white cursor-pointer shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      <FaMapMarkerAlt className="text-[#febb02]" />
                      <span>{hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(Math.round(hotel.rating))].map((_, i) => (
                        <FaStar key={i} className="text-[#febb02]" />
                      ))}
                      <span className="text-gray-600 ml-2">({hotel.rating})</span>
                    </div>
                    <p className="text-[#febb02] font-bold text-lg mt-4">
                      {intl.locale === "en"
                        ? `$${convertToUSD(hotel.price)} / night`
                        : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price)}/đêm`}
                    </p>
                  </div>
                </div>
              ))}
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