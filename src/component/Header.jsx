import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import VietNamFlag from "../assets/img/VietNam.png";
import AmericaFlag from "../assets/img/America.png";
import CircleHelp from "../assets/icon/CircleHelp";
import { AppContext } from "../context/ContextData";

function Header() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { setLocale, locale } = useContext(AppContext);

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown-container")) {
      setIsDropdownVisible(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold">
          Booking.com
        </Link>
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

          <div
            className={`absolute right-[280px] top-[49px] bg-[#f5f1f1] rounded-lg p-3 transition-all duration-500 ease-in-out overflow-hidden shadow-lg transform ${
              isDropdownVisible
                ? "max-h-[130px] opacity-100 scale-y-100"
                : "max-h-0 opacity-0 scale-y-0"
            } w-[130px] origin-top`}
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

          <Link
            className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3"
            to="/help"
          >
            <CircleHelp />
          </Link>

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
        </div>
      </div>
    </div>
  );
}

export default Header;
