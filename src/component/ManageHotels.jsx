import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";

// Mock data
const mockHotels = [
  { id: 1, name: "Vinpearl Resort & Spa Hạ Long", location: "Hạ Long, Quảng Ninh", status: "Active" },
  { id: 2, name: "Hanoi La Siesta", location: "Hà Nội", status: "Active" },
];

function ManageHotels() {
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
                  className="flex items-center w-full p-3 rounded-lg bg-[#febb02] text-white transition"
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
            <h2 className="text-2xl font-bold text-[#003b95] mb-6 flex items-center">
              <FaHotel className="mr-2" />
              <FormattedMessage id="admin.hotels" defaultMessage="Quản lý khách sạn" />
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="p-4 text-[#003b95] font-semibold">ID</th>
                    <th className="p-4 text-[#003b95] font-semibold">Tên khách sạn</th>
                    <th className="p-4 text-[#003b95] font-semibold">Vị trí</th>
                    <th className="p-4 text-[#003b95] font-semibold">Trạng thái</th>
                    <th className="p-4 text-[#003b95] font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHotels.map((hotel) => (
                    <tr key={hotel.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{hotel.id}</td>
                      <td className="p-4">{hotel.name}</td>
                      <td className="p-4">{hotel.location}</td>
                      <td className="p-4">{hotel.status}</td>
                      <td className="p-4">
                        <button className="text-[#febb02] hover:underline">Sửa</button>
                        <button className="text-red-500 hover:underline ml-2">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageHotels;