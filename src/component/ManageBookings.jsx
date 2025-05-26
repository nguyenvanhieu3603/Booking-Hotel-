import React, { } from "react";
import { Link} from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";

// Mock data
const mockBookings = [
  { id: 1, user: "Nguyễn Văn A", hotel: "Vinpearl Resort", checkIn: "2025-06-01", checkOut: "2025-06-05", status: "Confirmed" },
  { id: 2, user: "Trần Thị B", hotel: "Hanoi La Siesta", checkIn: "2025-07-01", checkOut: "2025-07-03", status: "Pending" },
];

function ManageBookings() {

  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <div className="p-8 w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#003b95] mb-8 flex items-center gap-2">
            <FaCalendarCheck className="text-[#febb02] text-3xl" />
            <FormattedMessage id="admin.bookings" defaultMessage="Quản lý đặt phòng" />
          </h2>
          <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="p-4 text-[#003b95] font-bold">ID</th>
                  <th className="p-4 text-[#003b95] font-bold">Khách hàng</th>
                  <th className="p-4 text-[#003b95] font-bold">Khách sạn</th>
                  <th className="p-4 text-[#003b95] font-bold">Ngày nhận phòng</th>
                  <th className="p-4 text-[#003b95] font-bold">Ngày trả phòng</th>
                  <th className="p-4 text-[#003b95] font-bold">Trạng thái</th>
                  <th className="p-4 text-[#003b95] font-bold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="bg-[#f8fafc] rounded-xl shadow hover:bg-[#febb02]/10 transition">
                    <td className="p-4 rounded-l-xl">{booking.id}</td>
                    <td className="p-4">{booking.user}</td>
                    <td className="p-4">{booking.hotel}</td>
                    <td className="p-4">{booking.checkIn}</td>
                    <td className="p-4">{booking.checkOut}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "Confirmed" ? "bg-[#003b95] text-white" : "bg-[#febb02]/80 text-[#003b95]"}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 rounded-r-xl">
                      <button className="text-[#febb02] font-bold hover:underline hover:text-[#003b95] transition">Sửa</button>
                      <button className="text-red-500 font-bold hover:underline ml-4 hover:text-red-700 transition">Hủy</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageBookings;