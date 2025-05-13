import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle, FaMapMarkerAlt, FaStar } from "react-icons/fa"; // Import react-icons
import Footer from "../component/Footer";
import Header from "../component/Header";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl"; // Import FormattedMessage
import Calendar from "react-calendar";

function HomePage() {
  const intl = useIntl();

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const convertToUSD = (priceInVND) => {
    const exchangeRate = 26000; // 1 USD = 26,000 VND
    return (priceInVND / exchangeRate).toFixed(2);
  };

  return (
    <div className="">
      {/* Hero */}
      <div className="bg-cover bg-center text-white h-205 bg-[url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')]">
        {/* Header */}
        <Header />
        <div className=" text-white mt-[150px] py-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">
              <FormattedMessage id="homepage.find_next_stay" defaultMessage="Tìm chỗ nghỉ tiếp theo" />
            </h1>
            <p className="text-center text-lg mb-6">
              <FormattedMessage id="homepage.find_deals" defaultMessage="Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa..." />
            </p>
            <div className="flex items-center justify-center gap-4 bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 border-r pr-4">
                <i className="fas fa-bed text-gray-500"></i>
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: "homepage.where_to_go", defaultMessage: "Bạn muốn đến đâu?" })}
                  className="outline-none text-gray-700"
                />
              </div>
              <div className="flex items-center gap-2 border-r pr-4">
                <i className="fas fa-calendar-alt text-gray-500"></i>
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  placeholderText={intl.formatMessage({ id: "homepage.check_in_date", defaultMessage: "Ngày nhận phòng" })}
                  className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02]"
                  minDate={new Date()}
                />
                <span className="text-gray-500">—</span>
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  placeholderText={intl.formatMessage({ id: "homepage.check_out_date", defaultMessage: "Ngày trả phòng" })}
                  className="outline-none text-gray-700 bg-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#febb02] focus:border-[#febb02]"
                  minDate={checkInDate || new Date()}
                />
              </div>
              <div className="relative">
                <div
                  className="flex items-center gap-2 border-r pr-4 cursor-pointer bg-gray-100 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-200 transition"
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  <i className="fas fa-user text-gray-500"></i>
                  <select
                    value={guests.adults}
                    onChange={(e) =>
                      setGuests({ ...guests, adults: parseInt(e.target.value) })
                    }
                    className="outline-none text-gray-700 bg-transparent cursor-pointer"
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
              </div>
              <button className="bg-[#febb02] cursor-pointer text-white px-6 py-2 rounded-full font-bold hover:bg-[#e0a800] transition">
                <FormattedMessage id="homepage.search" defaultMessage="Tìm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="container mx-auto mt-12">
        {/* Khách Sạn Nổi Bật */}
        <div className="mb-12 mt-9">
          <div className="flex justify-between items-center">
            
            <h2 className="text-2xl font-bold mb-2">
              <FormattedMessage id="homepage.featured_hotels" defaultMessage="Khách Sạn Nổi Bật" />
            </h2>

            <Link
              to={"/"}
              className="bg-[#febb02] text-white px-4 py-2 rounded-full font-bold hover:bg-[#e0a800] transition"
            >
              <FormattedMessage id="homepage.view_all" defaultMessage="Xem tất cả" />
            </Link>
          </div>
          <h4 className="font-light mb-6">
            <FormattedMessage id="homepage.top_choices" defaultMessage="Những lựa chọn hàng đầu cho kỳ nghỉ của bạn" />
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white cursor-pointer shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
              <img
                src="https://du-lich.chudu24.com/f/m/2105/20/khach-san-sai-gon-ha-long-64.jpg"
                alt="Hotel 1"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Vinpearl Resort & Spa Hạ Long
                </h3>
                <p className="text-gray-500 mt-2">Hạ Long, Quảng Ninh</p>
                <p className="text-[#febb02] font-bold text-lg mt-4">
                  {intl.locale === "en"
                    ? `$${convertToUSD(2990000)} / night`
                    : "2.990.000 VND/đêm"}
                </p>
              </div>
            </div>
            <div className="bg-white cursor-pointer shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
              <img
                src="https://royalhalonghotel.com/wp-content/uploads/2023/05/Royal-Ha-Long-slider-02.jpg"
                alt="Hotel 2"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Hanoi La Siesta
                </h3>
                <p className="text-gray-500 mt-2">Hà Nội</p>
                <p className="text-[#febb02] font-bold text-lg mt-4">
                  {intl.locale === "en"
                    ? `$${convertToUSD(1690000)} / night`
                    : "1.690.000 VND/đêm"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Điểm Đến Phổ Biến */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-2">
              <FormattedMessage id="homepage.popular_destinations" defaultMessage="Điểm Đến Phổ Biến" />
            </h2>
            <Link
              to={"/"}
              className="bg-[#febb02] text-white px-4 py-2 rounded-full font-bold hover:bg-[#e0a800] transition"
            >
              <FormattedMessage id="homepage.view_all" defaultMessage="Xem tất cả" />
            </Link>
          </div>
          <h4 className="font-light mb-6">
            <FormattedMessage id="homepage.explore_destinations" defaultMessage="Khám phá các địa điểm thu hút khách du lịch" />
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white cursor-pointer shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
              <img
                src="https://image-tc.galaxy.tf/wijpeg-badmmtam0acrjkvm41xc4dt3e/he-nay-ru-ban-be-du-29-04-2018-02-12_standard.jpg?crop=70%2C0%2C691%2C518"
                alt="Hạ Long"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">Hạ Long</h3>
                <p className="text-gray-500 mt-2">40 khách sạn</p>
              </div>
            </div>
            <div className="bg-white cursor-pointer shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
              <img
                src="https://vcdn1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg"
                alt="Đà Nẵng"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">Đà Nẵng</h3>
                <p className="text-gray-500 mt-2">50 khách sạn</p>
              </div>
            </div>
            <div className="bg-white cursor-pointer shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
              <img
                src="https://nld.mediacdn.vn/291774122806476800/2024/8/16/tp-65-1723817004792851519414.jpg"
                alt="TP Hồ Chí Minh"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  TP Hồ Chí Minh
                </h3>
                <p className="text-gray-500 mt-2">60 khách sạn</p>
              </div>
            </div>
          </div>
        
        </div>

        {/* Tại Sao Chọn Booking */}
        <div className="mb-12 bg-[#f8f9fa] p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <FormattedMessage id="homepage.why_choose_booking" defaultMessage="Tại Sao Chọn Booking" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center flex flex-col items-center bg-white shadow-md rounded-lg p-6">
              <FaCheckCircle className="text-[#febb02] text-4xl mb-4 justify-center" />
              <h3 className="text-lg font-semibold">
                <FormattedMessage id="homepage.best_choices" defaultMessage="Lựa Chọn Tốt Nhất" />
              </h3>
              <p className="text-gray-500">
                <FormattedMessage id="homepage.best_choices_desc" defaultMessage="Hợp tác với các khách sạn hàng đầu để đảm bảo chất lượng dịch vụ." />
              </p>
            </div>
            <div className="text-center flex flex-col items-center bg-white shadow-md rounded-lg p-6">
              <FaMapMarkerAlt className="text-[#febb02] text-4xl mb-4 justify-center" />
              <h3 className="text-lg font-semibold">
                <FormattedMessage id="homepage.convenient_locations" defaultMessage="Vị Trí Thuận Tiện" />
              </h3>
              <p className="text-gray-500">
                <FormattedMessage id="homepage.convenient_locations_desc" defaultMessage="Các khách sạn của chúng tôi nằm ở những vị trí đặc sắc." />
              </p>
            </div>
            <div className="text-center flex flex-col items-center bg-white shadow-md rounded-lg p-6">
              <FaStar className="text-[#febb02] text-4xl mb-4 justify-center" />
              <h3 className="text-lg font-semibold">
                <FormattedMessage id="homepage.trustworthy_reviews" defaultMessage="Đánh Giá Tin Cậy" />
              </h3>
              <p className="text-gray-500">
                <FormattedMessage id="homepage.trustworthy_reviews_desc" defaultMessage="Đánh giá từ các khách hàng giúp bạn lựa chọn chính xác." />
              </p>
            </div>
          </div>
        </div>

        {/* Khách Hàng Nói Gì */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <FormattedMessage id="homepage.customer_feedback" defaultMessage="Khách Hàng Nói Gì" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-500 italic">
                "Kỳ nghỉ tuyệt vời tại khách sạn này! Căn phòng rất sạch sẽ,
                nhân viên thân thiện và dịch vụ hoàn hảo. Chắc chắn sẽ quay
                lại!"
              </p>
              <p className="text-right font-semibold mt-4">- Nguyễn Thị Mai</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-500 italic">
                "Mọi thứ hoàn hảo từ vị trí thuận tiện đến chất lượng dịch vụ.
                Chắc chắn sẽ giới thiệu cho bạn bè!"
              </p>
              <p className="text-right font-semibold mt-4">- Trần Văn Nam</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-500 italic">
                "Khách sạn rất đẹp và tiện nghi. Nhân viên hỗ trợ nhiệt tình.
                Rất hài lòng với kỳ nghỉ của mình!"
              </p>
              <p className="text-right font-semibold mt-4">- Lê Hoàng Anh</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
