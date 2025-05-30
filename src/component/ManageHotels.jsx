import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";

function ManageHotels() {
  const [hotels, setHotels] = useState([]);

  
  const fetchHotels = () => {
    axios.get("http://localhost/bookingBackend/api/hotel/list")
    .then((res) => {
      setHotels(res.data);
    })
      .catch((err) => {
        console.error("Failed to fetch hotels:", err);
      });
    };
    
    const handleDelete = (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa/ẩn khách sạn này?")) {
        axios.get(`http://localhost/bookingBackend/api/hotel/delete?id=${id}`)
        .then(() => {
          // Sau khi xóa thành công, cập nhật lại danh sách khách sạn
          fetchHotels();
        })
        .catch((err) => {
          alert("Xóa/ẩn khách sạn thất bại!");
          console.error("Failed to delete hotel:", err);
        });
      }
    };
    useEffect(() => {
      fetchHotels();
    }, []);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <div className="p-8 w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#003b95] mb-8 flex items-center gap-2">
            <FaHotel className="text-[#febb02] text-3xl" />
            <FormattedMessage id="admin.hotels" defaultMessage="Quản lý khách sạn" />
          </h2>
          <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="p-4 text-[#003b95] font-bold">ID</th>
                  <th className="p-4 text-[#003b95] font-bold">Tên khách sạn</th>
                  <th className="p-4 text-[#003b95] font-bold">Địa chỉ</th>
                  <th className="p-4 text-[#003b95] font-bold">Trạng thái</th>
                  <th className="p-4 text-[#003b95] font-bold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="bg-[#f8fafc] rounded-xl shadow hover:bg-[#febb02]/10 transition">
                    <td className="p-4 rounded-l-xl">{hotel.id}</td>
                    <td className="p-4 font-semibold">{hotel.name}</td>
                    <td className="p-4">{hotel.address}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${!hotel.active ? 'bg-[#003b95] text-white' : 'bg-gray-300 text-gray-700'}`}>{!hotel.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-4 rounded-r-xl">
                      <button className="cursor-pointer text-[#febb02] font-bold hover:underline hover:text-[#003b95] transition">Sửa</button>
                      <button
                        className="cursor-pointer text-red-500 font-bold hover:underline ml-4 hover:text-red-700 transition"
                        onClick={() => handleDelete(hotel.id)}
                      >
                        Xóa
                      </button>
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

export default ManageHotels;