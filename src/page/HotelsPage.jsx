import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HotelsPage() {
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [amenities, setAmenities] = useState({
    wifi: false,
    pool: false,
    spa: false,
    restaurant: false,
    fitness: false,
  });

  const handleAmenityChange = (amenity) => {
    setAmenities({
      ...amenities,
      [amenity]: !amenities[amenity],
    });
  };

  // Dữ liệu khách sạn giả lập (tương tự mockData)
  const hotels = [
    { id: 1, name: "Khách sạn A", price: 100, amenities: ["wifi", "pool"], rating: 5 },
    { id: 2, name: "Khách sạn B", price: 200, amenities: ["spa", "restaurant"], rating: 4 },
    { id: 3, name: "Khách sạn C", price: 150, amenities: ["fitness"], rating: 3 },
  ];

  return (
    <div className="bg-[#003b95] text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header giống HomePage */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            Booking.com
          </Link>
          <div className="flex items-center space-x-3">
            <Link className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3" to="/">
              VNĐ
            </Link>
            <Link className="hover:opacity-90 hover:bg-[#6987b6] rounded-lg p-3" to="/help">
              Hỗ trợ
            </Link>
            <Link className="text-[#1075e4] bg-[#ffffff] hover:opacity-90 rounded-lg p-2 px-4" to="/register">
              Đăng ký
            </Link>
            <Link className="text-[#1075e4] bg-[#ffffff] hover:opacity-90 rounded-lg p-2 px-4" to="/login">
              Đăng nhập
            </Link>
          </div>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-4xl font-bold text-center mb-4">Tìm Khách Sạn Lý Tưởng</h1>
        <p className="text-center text-lg mb-6">Khám phá và lọc danh sách khách sạn cao cấp của chúng tôi</p>

        {/* Form tìm kiếm (giống HomePage) */}
        <div className="flex items-center justify-center gap-4 bg-white rounded-full p-4 shadow-md mb-8">
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

        {/* Nội dung chính */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bộ lọc */}
          <div className="w-full md:w-1/4">
            <div className="bg-white text-gray-700 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4">Bộ Lọc</h2>

              {/* Khoảng giá */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-2">Khoảng Giá</h3>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0] * 100000)}</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1] * 100000)}+</span>
                </div>
              </div>

              {/* Tiện nghi */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-2">Tiện Nghi</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="wifi"
                      checked={amenities.wifi}
                      onChange={() => handleAmenityChange('wifi')}
                    />
                    <label htmlFor="wifi" className="text-sm">WiFi Miễn Phí</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pool"
                      checked={amenities.pool}
                      onChange={() => handleAmenityChange('pool')}
                    />
                    <label htmlFor="pool" className="text-sm">Hồ Bơi</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="spa"
                      checked={amenities.spa}
                      onChange={() => handleAmenityChange('spa')}
                    />
                    <label htmlFor="spa" className="text-sm">Spa</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="restaurant"
                      checked={amenities.restaurant}
                      onChange={() => handleAmenityChange('restaurant')}
                    />
                    <label htmlFor="restaurant" className="text-sm">Nhà Hàng</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="fitness"
                      checked={amenities.fitness}
                      onChange={() => handleAmenityChange('fitness')}
                    />
                    <label htmlFor="fitness" className="text-sm">Phòng Gym</label>
                  </div>
                </div>
              </div>

              {/* Xếp hạng sao */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-2">Xếp Hạng Sao</h3>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2].map((rating) => (
                    <span
                      key={rating}
                      className="border border-gray-300 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-[#febb02] hover:text-white transition"
                    >
                      {rating}+ Sao
                    </span>
                  ))}
                </div>
              </div>

              {/* Nút áp dụng bộ lọc */}
              <button className="w-full bg-[#febb02] text-white py-2 rounded-full font-bold hover:bg-[#e0a800] transition">
                Áp Dụng Bộ Lọc
              </button>
            </div>
          </div>

          {/* Danh sách khách sạn */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white text-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price * 100000)} / đêm
                  </p>
                  <p className="text-sm mt-2">Tiện nghi: {hotel.amenities.join(', ')}</p>
                  <p className="text-sm">Xếp hạng: {hotel.rating} sao</p>
                  <Link
                    to={`/hotel/${hotel.id}`}
                    className="mt-4 block text-center bg-[#febb02] text-white py-2 rounded-full font-bold hover:bg-[#e0a800] transition"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelsPage;