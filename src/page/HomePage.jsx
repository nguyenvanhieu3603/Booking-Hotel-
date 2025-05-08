import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VietNamFlag from "../assets/img/VietNam.png";
import AmericaFlag from "../assets/img/America.png";
import CircleHelp from "../assets/icon/CircleHelp";
import Footer from "../component/Footer";

function HomePage() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown-container")) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      {/* Hero */}
      <div className="bg-[#003b95] text-white h-55">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex bg-[#003b95] justify-between items-center py-4 ">
            <Link to={"/"} className="text-2xl font-bold">
              Booking.com
            </Link>
            <div className="flex items-center space-x-3 relative dropdown-container">
              <Link
                className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3 "
                to={"/"}
              >
                VNĐ
              </Link>
              <div className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3">
                <img
                  src={VietNamFlag}
                  alt="Vietnam Flag"
                  className="rounded-full w-6 h-6 object-cover cursor-pointer  "
                  onClick={toggleDropdown}
                />
              </div>
              <div
                className={`absolute right-[280px] top-[49px] bg-[#f5f1f1] rounded-lg p-3 transition-all duration-500 ease-in-out overflow-hidden shadow-lg transform ${
                  isDropdownVisible
                    ? "max-h-[130px] opacity-100 scale-y-100"
                    : "max-h-0 opacity-0 scale-y-0"
                } w-[130px] origin-top`}
              >
                <ul className="text-[#003b95]">
                  <li className="flex justify-between py-1 hover:bg-gray-200 cursor-pointer">
                    <span>Tiếng Việt</span>
                    <img
                      src={VietNamFlag}
                      alt="Vietnam Flag"
                      className="rounded-full w-6 h-6 object-cover cursor-pointer"
                    />
                  </li>
                  <li className="flex justify-between py-1 hover:bg-gray-200 cursor-pointer">
                    <span>English</span>
                    <img
                      src={AmericaFlag}
                      alt="America Flag"
                      className="rounded-full w-6 h-6 object-cover cursor-pointer"
                    />
                  </li>
                </ul>
              </div>

              <Link
                className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3"
                to={"/help"}
              >
                <CircleHelp />
              </Link>
              <Link
                className="text-[#1075e4] bg-[#ffffff] hover:opacity-90 rounded-lg p-2 px-4"
                to={"/help"}
              >
                Đăng ký
              </Link>
              <Link
                className="text-[#1075e4] bg-[#ffffff] hover:opacity-90 rounded-lg p-2 px-4"
                to={"/help"}
              >
                Đăng nhập
              </Link>
            </div>
          </div>

          
        </div>
      </div>
      <div className="bg-[#003b95] text-white py-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Tìm chỗ nghỉ tiếp theo</h1>
          <p className="text-center text-lg mb-6">Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...</p>
          <div className="flex items-center justify-center gap-4 bg-white rounded-full p-4 shadow-md">
            <div className="flex items-center gap-2 border-r pr-4">
              <i className="fas fa-bed text-gray-500"></i>
              <input
                type="text"
                placeholder="Bạn muốn đến đâu?"
                className="outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center gap-2 border-r pr-4">
              <i className="fas fa-calendar-alt text-gray-500"></i>
              <span className="text-gray-700">Ngày nhận phòng — Ngày trả phòng</span>
            </div>
            <div className="flex items-center gap-2 border-r pr-4">
              <i className="fas fa-user text-gray-500"></i>
              <span className="text-gray-700">2 người lớn - 0 trẻ em - 1 phòng</span>
            </div>
            <button className="bg-[#febb02] text-white px-6 py-2 rounded-full font-bold hover:bg-[#e0a800] transition">
              Tìm
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
