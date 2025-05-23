import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";

function AdminDashboard() {
  const { setIsAuth } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-[#003b95] text-white">
        <Header />
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed">
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#003b95] mb-6">Admin Dashboard</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/users"
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaUsers className="mr-3" />
                  <FormattedMessage id="admin.users" defaultMessage="Quản lý người dùng" />
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/hotels"
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaHotel className="mr-3" />
                  <FormattedMessage id="admin.hotels" defaultMessage="Quản lý khách sạn" />
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/bookings"
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaCalendarCheck className="mr-3" />
                  <FormattedMessage id="admin.bookings" defaultMessage="Quản lý đặt phòng" />
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/profile"
                  className="flex items-center w-full p-3 rounded-lg text-[#003b95] hover:bg-[#febb02] hover:text-white transition"
                >
                  <FaUserCircle className="mr-3" />
                  <FormattedMessage id="admin.profile" defaultMessage="Thông tin cá nhân" />
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 rounded-lg text-left text-red-500 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-3" />
                  <FormattedMessage id="admin.logout" defaultMessage="Đăng xuất" />
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Main Content */}
        <div className="ml-64 p-8 w-full">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-[#003b95] mb-6">
              <FormattedMessage id="admin.welcome" defaultMessage="Chào mừng đến với Dashboard Admin" />
            </h2>
            <p className="text-gray-700">
              <FormattedMessage
                id="admin.select_option"
                defaultMessage="Vui lòng chọn một mục từ menu bên trái để quản lý."
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;