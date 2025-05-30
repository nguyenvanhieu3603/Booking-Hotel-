import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link} from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost/bookingBackend/api/booking/all")
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
      });
  }, []);

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
                {bookings.map((booking) => (
                  <tr key={booking.id} className="bg-[#f8fafc] rounded-xl shadow hover:bg-[#febb02]/10 transition">
                    <td className="p-4 rounded-l-xl">{booking.id}</td>
                    <td className="p-4">{booking.userName}</td>
                    <td className="p-4">{booking.hotelName}</td>
                    <td className="p-4">{booking.checkInDate}</td>
                    <td className="p-4">{booking.checkOutDate}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.statusId === "confirmed" ? "bg-[#003b95] text-white" : "bg-[#febb02]/80 text-[#003b95]"}`}>
                        {booking.statusId}
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