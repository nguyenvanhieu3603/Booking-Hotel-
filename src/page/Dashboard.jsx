import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaUsers,
  FaHotel,
  FaCalendarCheck,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";
import axios from "axios";

function Dashboard() {
  const { setIsAuth } = useContext(AppContext);
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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Fixed Header */}
      <div className="bg-[#003b95] text-white fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="ml-50 w-64 bg-white shadow-lg h-screen fixed top-0 left-0 pt-[64px]">
          {/* pt-[64px] để tránh bị header che sidebar, chỉnh lại nếu header cao khác */}
          <div className="p-6">
            <Link
              to={"/dashboard"}
              className=" text-xl font-bold text-[#003b95] mb-6 cursor-pointer "
            >
              <h2 className="py-4">Admin Dashboard</h2>
            </Link>
            <ul className="space-y-2">
              <li>
                <Link
                  to={"/dashboard/users"}
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaUsers className="mr-3" />
                  <FormattedMessage
                    id="admin.users"
                    defaultMessage="Quản lý người dùng"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to={"/dashboard/hotels"}
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaHotel className="mr-3" />
                  <FormattedMessage
                    id="admin.hotels"
                    defaultMessage="Quản lý khách sạn"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to={"/dashboard/bookings"}
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaCalendarCheck className="mr-3" />
                  <FormattedMessage
                    id="admin.bookings"
                    defaultMessage="Quản lý đặt phòng"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to={"/dashboard/profile"}
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaUserCircle className="mr-3" />
                  <FormattedMessage
                    id="admin.profile"
                    defaultMessage="Thông tin cá nhân"
                  />
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center w-full p-3 rounded-lg text-left text-red-500 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-3" />
                  <FormattedMessage
                    id="admin.logout"
                    defaultMessage="Đăng xuất"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8 w-full pt-[64px]">
          {/* pt-[64px] để tránh bị header che nội dung, chỉnh lại nếu header cao khác */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
