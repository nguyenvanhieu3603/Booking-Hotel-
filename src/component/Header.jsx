import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

import VietNamFlag from "../assets/img/VietNam.png";
import AmericaFlag from "../assets/img/America.png";
import { AppContext } from "../context/ContextData";

function Header() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { setLocale, locale, isAuth, setIsAuth } = useContext(AppContext);
  const [isAdmin, setIsAdmin] = useState(false);



  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost/bookingBackend/api/user/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        localStorage.clear();
        setIsAuth(false); // Thêm dòng này để cập nhật trạng thái đăng nhập
      }
    } catch (error) {
      // Có thể xử lý lỗi nếu cần
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra. Vui lòng thử lại.";
    }
  };


  

  useEffect(() => {
    const objectUser = JSON.parse(localStorage.getItem("user"));
    objectUser.role === "admin" ? setIsAdmin(true) : setIsAdmin(false);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold">
          Booking.com
        </Link>
        <div className="hidden md:flex items-center space-x-1 text-[20px]">
          <Link
            to={"/"}
            className="hover:opacity-90 font-[400] hover:bg-[#6987b6] rounded-lg p-3 transition"
          >
            <FormattedMessage id="header.home" defaultMessage="Trang chủ" />
          </Link>
          <Link
            to={"/home-list"}
            className="hover:opacity-90 font-[400] hover:bg-[#6987b6] rounded-lg p-3 transition"
          >
            <FormattedMessage id="header.hotels" defaultMessage="Khách sạn" />
          </Link>
          <Link
            to={"/"}
            className="hover:opacity-90 font-[400] hover:bg-[#6987b6] rounded-lg p-3 transition"
          >
            <FormattedMessage
              id="header.destinations"
              defaultMessage="Điểm đến"
            />
          </Link>
          <Link
            to={"/about-us"}
            className="hover:opacity-90 font-[400] hover:bg-[#6987b6] rounded-lg p-3 transition"
          >
            <FormattedMessage id="header.about" defaultMessage="Giới thiệu" />
          </Link>
        </div>
        <div className="flex items-center space-x-3 relative dropdown-container">
          <Link
            className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3"
            to="/"
          >
            <FormattedMessage id="app.currency" defaultMessage="VNĐ" />
          </Link>

          <div className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3">
            <img
              src={locale == "vi" ? VietNamFlag : AmericaFlag}
              alt="Vietnam Flag"
              className="rounded-full w-6 h-6 object-cover cursor-pointer"
              onClick={toggleDropdown}
            />
          </div>
          {isAdmin && (
            <Link
            to={"/dashboard"}
              className="flex items-center justify-center text-[#818080] text-2xl cursor-pointer mr-4 mx-1 focus:outline-none"
              style={{ background: "none", border: "none" }}
              // onClick={handleUserIconClick}
              title="Thông tin cá nhân"
              type="button"
            >
              <FaUserCircle />
              {/* Nếu không dùng react-icons thì thay bằng: <span style={{fontSize: 28}}>👤</span> */}
            </Link>
          )}
          <div
            className={`absolute top-[49px] bg-[#f5f1f1] rounded-lg p-3 transition-all duration-500 ease-in-out overflow-hidden shadow-lg transform ${
              isDropdownVisible
                ? "max-h-[130px] opacity-100 scale-y-100"
                : "max-h-0 opacity-0 scale-y-0"
            } w-[130px] origin-top ${
              isAuth ? "right-[115px]" : "right-[230px]"
            }`}
          >
            <ul className="text-[#003b95]">
              <li
                className="flex justify-between py-1 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setLocale("vi");
                  setIsDropdownVisible(false);
                }}
              >
                <span>Tiếng Việt</span>
                <img
                  src={VietNamFlag}
                  alt="Vietnam Flag"
                  className="rounded-full w-6 h-6 object-cover"
                />
              </li>
              <li
                className="flex justify-between py-1 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setLocale("en");
                  setIsDropdownVisible(false);
                }}
              >
                <span>English</span>
                <img
                  src={AmericaFlag}
                  alt="America Flag"
                  className="rounded-full w-6 h-6 object-cover"
                />
              </li>
            </ul>
          </div>

          {/* <Link
            className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3"
            to="/help"
          >
            <CircleHelp />
          </Link> */}

          {isAuth ? (
            <button
              // to={"/login"}
              className="text-[#1075e4] bg-[#ffffff] hover:opacity-90 rounded-lg cursor-pointer p-2 px-4 w-[110px] flex items-center justify-center"
              onClick={handleLogout}
            >
              <FormattedMessage id="app.logout" defaultMessage="Đăng xuất" />
            </button>
          ) : (
            <>
              <Link
                className="text-[#1075e4] bg-[#ffffff] hover:opacity-90 rounded-lg p-2 px-4 w-[100px] flex items-center justify-center"
                to={"/register"}
              >
                <FormattedMessage id="app.register" defaultMessage="Register" />
              </Link>

              <Link
                className="text-[#1075e4] bg-[#ffffff] hover:opacity-90 rounded-lg p-2 px-4 w-[110px] flex items-center justify-center"
                to={"/login"}
              >
                <FormattedMessage id="app.login" defaultMessage="Login" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
