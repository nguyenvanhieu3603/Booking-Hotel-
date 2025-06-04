import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";

function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage, setHotelsPerPage] = useState(10);

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

  // Pagination logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleHotelsPerPageChange = (e) => {
    setHotelsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <div className="p-8 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-extrabold text-[#003b95] mb-8 flex items-center gap-2">
              <FaHotel className="text-[#febb02] text-3xl" />
              <FormattedMessage id="admin.hotels" defaultMessage="Quản lý khách sạn" />
            </h2>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard/hotels/create"
                className="bg-[#febb02] text-white font-bold px-5 py-2 rounded-full shadow hover:bg-[#e0a800] transition"
              >
                + Thêm khách sạn mới
              </Link>
              <div className="flex items-center gap-2">
                <label htmlFor="hotelsPerPage" className="text-gray-700 font-medium">Hiển thị:</label>
                <select
                  id="hotelsPerPage"
                  value={hotelsPerPage}
                  onChange={handleHotelsPerPageChange}
                  className="border border-[#febb02] rounded px-3 py-1 focus:ring-2 focus:ring-[#febb02] focus:outline-none bg-white shadow-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-gray-500">khách sạn/trang</span>
              </div>
            </div>
          </div>
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
                {currentHotels.map((hotel) => (
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
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#003b95] text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageHotels;