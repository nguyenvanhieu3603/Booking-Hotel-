import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { FormattedMessage, useIntl } from "react-intl";
import { FaMapMarkerAlt, FaStar, FaBed, FaCalendarAlt, FaUser, FaCheck } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function HotelDetail() {
  const { id } = useParams();
  const intl = useIntl();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [availableRooms, setAvailableRooms] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const backendUrl = "http://localhost/bookingBackend";

  // Lấy dữ liệu khách sạn và phòng
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const hotelResponse = await axios.get(`${backendUrl}/api/hotel/get`, {
          params: { id },
        });
        setHotel(hotelResponse.data);

        const roomsResponse = await axios.get(`${backendUrl}/api/room/list`, {
          params: { hotelId: id, limit: 10 },
        });
        console.log("Dữ liệu phòng:", roomsResponse.data); // Debug
        setRooms(roomsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  // Kiểm tra phòng trống
  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate || !guests) {
      alert("Vui lòng chọn ngày nhận phòng, trả phòng và số khách");
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/room/available`, {
        params: {
          hotelId: id,
          checkInDate: checkInDate.toISOString().split("T")[0],
          checkOutDate: checkOutDate.toISOString().split("T")[0],
          people: guests,
        },
      });
      setAvailableRooms(response.data);
    } catch (error) {
      console.error("Lỗi khi kiểm tra phòng trống:", error);
      alert("Không thể kiểm tra phòng trống. Vui lòng thử lại.");
    }
  };

  const convertToUSD = (priceInVND) => {
    const exchangeRate = 26000;
    return (priceInVND / exchangeRate).toFixed(2);
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  if (!hotel) {
    return <div className="text-center py-10">Không tìm thấy khách sạn</div>;
  }

  // Danh sách tiện ích giả lập
  const amenitiesList = [
    { name: "WiFi Miễn Phí", icon: <FaCheck className="text-green-500" /> },
    { name: "Hồ Bơi", icon: <FaCheck className="text-green-500" /> },
    { name: "Spa", icon: <FaCheck className="text-green-500" /> },
    { name: "Nhà Hàng", icon: <FaCheck className="text-green-500" /> },
    { name: "Phòng Gym", icon: <FaCheck className="text-green-500" /> },
  ];

  // Đánh giá giả lập
  const reviews = [
    { user: "Nguyễn Văn A", rating: 4.5, comment: "Khách sạn tuyệt vời, dịch vụ tốt!" },
    { user: "Trần Thị B", rating: 4.0, comment: "Phòng sạch sẽ, nhưng WiFi hơi chậm." },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto mt-12 px-4 pb-12">
        {/* Ảnh khách sạn */}
        <img
          src={hotel.images[0] ? `${backendUrl}/${hotel.images[0]}` : "https://via.placeholder.com/1200x400"}
          alt={hotel.name}
          className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8"
          onError={(e) => { e.target.src = "https://via.placeholder.com/1200x400"; }}
        />

        {/* Nội dung chính */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Nội dung bên trái */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-extrabold mb-4 text-[#003b95]">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <FaMapMarkerAlt className="text-[#febb02]" />
              <span>{hotel.address}</span>
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(Math.round(hotel.rating || 0))].map((_, i) => (
                <FaStar key={i} className="text-[#febb02]" />
              ))}
              <span className="text-gray-600 ml-2 font-semibold">({hotel.rating || 0})</span>
            </div>

            {/* Tab điều hướng */}
            <div className="flex border-b border-gray-200 mb-6">
              {["overview", "rooms", "amenities", "reviews"].map((tab) => (
                <button
                  key={tab}
                  className={`cursor-pointer px-4 py-2 font-medium text-gray-700 ${activeTab === tab ? "border-b-2 border-[#febb02] text-[#003b95]" : "hover:text-[#febb02]"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <FormattedMessage
                    id={`hoteldetail.tab_${tab}`}
                    defaultMessage={
                      tab === "overview" ? "Tổng Quan" :
                      tab === "rooms" ? "Phòng" :
                      tab === "amenities" ? "Tiện Nghi" :
                      "Đánh Giá"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Nội dung tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="cupoint text-2xl font-bold mb-4 text-[#003b95]">
                  <FormattedMessage id="hoteldetail.overview" defaultMessage="Tổng Quan" />
                </h2>
                <p className="text-gray-600 mb-4">{hotel.description || "Không có mô tả"}</p>
                <h3 className="text-xl font-semibold mb-2 text-[#003b95]">
                  <FormattedMessage id="hoteldetail.amenities" defaultMessage="Tiện Nghi" />
                </h3>
                <ul className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      {amenity.icon}
                      <span>{amenity.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "rooms" && (
              <div>
                <h2 className="cursor-pointer text-2xl font-bold mb-4 text-[#003b95]">
                  <FormattedMessage id="hoteldetail.room_types" defaultMessage="Các Loại Phòng" />
                </h2>
                {rooms.length > 0 ? (
                  <div className="space-y-6">
                    {rooms.map((room) => (
                      <div key={room.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row gap-4">
                        {/* Cột trái: Tên phòng, Loại phòng, Tiện nghi */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-600 text-sm">
                              Phòng: {room.roomType }
                            </span>
                            <h3 className="text-lg font-bold text-[#003b95]">{room.name}</h3>
                          </div>
                          <p className="text-gray-600 mb-2">Tiện nghi:</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {(room.amenities ? room.amenities.split(",") : ["Không có"]).map((amenity, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <FaCheck className="text-green-500" />
                                {amenity.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Cột phải: Giá và Nút Chọn Phòng */}
                        <div className="flex flex-col items-end justify-between">
                          <p className="text-[#febb02] font-bold text-lg mb-2">
                            {intl.locale === "en"
                              ? `$${convertToUSD(room.price || 0)}`
                              : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price || 0)}`}{" "}
                            /đêm
                          </p>
                          <button className="bg-[#6b46c1] text-white px-4 py-2 rounded-full font-bold hover:bg-[#553c9a] transition">
                            <FormattedMessage id="hoteldetail.select_room" defaultMessage="Chọn Phòng" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Không có phòng nào được tìm thấy.</p>
                )}
              </div>
            )}

            {activeTab === "amenities" && (
              <div>
                <h2 className="cupoint text-2xl font-bold mb-4 text-[#003b95]">
                  <FormattedMessage id="hoteldetail.amenities" defaultMessage="Tiện Nghi" />
                </h2>
                <ul className="grid grid-cols-2 gap-4">
                  {amenitiesList.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      {amenity.icon}
                      <span>{amenity.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="cupoint text-2xl font-bold mb-4 text-[#003b95]">
                  <FormattedMessage id="hoteldetail.reviews" defaultMessage="Đánh Giá" />
                </h2>
                <p className="text-gray-600 mb-4">
                  Điểm trung bình: <span className="font-bold">{hotel.rating || 0}</span> / 5
                </p>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-semibold text-[#003b95]">{review.user}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(Math.round(review.rating))].map((_, i) => (
                          <FaStar key={i} className="text-[#febb02]" />
                        ))}
                        <span className="text-gray-600 ml-2">({review.rating})</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Biểu mẫu đặt phòng bên phải */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-4">
              <h2 className="text-2xl font-bold mb-4 text-[#003b95]">
                <FormattedMessage id="hoteldetail.book_room" defaultMessage="Đặt Phòng" />
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">
                    <FormattedMessage id="hoteldetail.check_in" defaultMessage="Nhận phòng" />
                  </label>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#003b95]" />
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      placeholderText={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage:"Check-in Date" })}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#febb02] transition-colors"
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      dayClassName={(date) =>
                        checkInDate && date.toDateString() === checkInDate.toDateString() ? "bg-[#6b46c1] text-white rounded-full" : ""
                      } />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">
                    <FormattedMessage id="hoteldetail.checkout" defaultMessage="Trả phòng" />
                  </label>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#003b95]" />
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      placeholderText={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage:"Check-out Date" })}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#febb02] transition-colors"
                      minDate={checkInDate || new Date()}
                      dateFormat="dd/MM/yyyy"
                      dayClassName={(date) =>
                        checkOutDate && date.toDateString() === checkOutDate.toDateString() ? "bg-[#6b46c1] text-white rounded-full" : ""
                      } />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">
                    <FormattedMessage id="hoteldetail.guests" defaultMessage="Guests" />
                  </label>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-[#003b95]" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg shadow-sm cursor-pointer focus:ring-2 focus:ring-[#febb02] transition-colors"
                    >
                      <option value="1">1 Khách</option>
                      <option value="2">2 Khách</option>
                      <option value="3">3 Khách</option>
                      <option value="4">4 Khách</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={checkAvailability}
                  className="w-full cursor-pointer px-4 py-3 text-sm font-bold text-white rounded-full bg-[#febb02] hover:bg-[#d89b00] transition-colors"
                >
                  <FormattedMessage
                    id="hoteldetail.check_availability"
                    defaultMessage="Kiểm tra đặt phòng"
                  />
                </button>
              </div>
              {/* Kết quả kiểm tra tính khả dụng của phòng */}
              {availableRooms && (
                <div className="mt-4">
                  <h3 className="mb-2 text-lg font-semibold text-[#003b95]">
                    <FormattedMessage
                      id="hoteldetail.available_rooms"
                      defaultMessage="Available Rooms"
                    />
                  </h3>
                  {availableRooms.length > 0 ? (
                    <ul className="space-y-2">
                      {availableRooms.map((room) => (
                        <li key={room.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold">{room.name}</p>
                          <p className="text-[#b45309] font-semibold">
                            {intl.locale === "en"
                              ? `$${convertToUSD(room.price || 0)}`
                              : `${new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(room.price || 0)}`}{' '}
                            / đêm
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      Không có phòng trống trong khoảng thời gian đã chọn.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default HotelDetail;
