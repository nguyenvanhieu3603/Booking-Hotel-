import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Header from "../component/Header";
import Footer from "../component/Footer";
import axios from "axios";
import { Link } from "react-router-dom";

function DestinationsPage() {
  const backendUrl = "http://localhost/bookingBackend";

  // Dữ liệu địa điểm với ảnh cố định
  const destinations = [
    {
      name: "Hà Nội",
      image: "https://vcdn1-dulich.vnecdn.net/2022/05/12/Hanoi2-1652338755-3632-1652338809.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=NxMN93PTvOTnHNryMx3xJw",
    },
    {
      name: "Hạ Long",
      image: "https://image-tc.galaxy.tf/wijpeg-badmmtam0acrjkvm41xc4dt3e/he-nay-ru-ban-be-du-29-04-2018-02-12_standard.jpg?crop=70,0,691,518",
    },
    {
      name: "Đà Nẵng",
      image: "https://vcdn1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg",
    },
    {
      name: "TP. Hồ Chí Minh",
      image: "https://nld.mediacdn.vn/291774122806476800/2024/8/16/tp-65-1723817004792851519414.jpg",
    },
    {
      name: "Phú Quốc",
      image: "https://khaihoanphuquoc.com.vn/wp-content/uploads/2023/11/du-lich-phu-quoc-thang-10-1.jpg",
    },
  ];

  // Cuộn lên đầu trang khi component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [provinceHotelCounts, setProvinceHotelCounts] = useState({});

  useEffect(() => {
    const provinceApiMap = {
      "Hà Nội": "Hanoi",
      "Hạ Long": "Ha Long",
      "Đà Nẵng": "Da Nang",
      "TP. Hồ Chí Minh": "Ho Chi Minh",
      "Phú Quốc": "Phu Quoc",
    };
    const fetchCounts = async () => {
      const counts = {};
      for (const destination of destinations) {
        const apiName = provinceApiMap[destination.name] || destination.name;
        try {
          const response = await axios.get(`${backendUrl}/api/hotel/provinceCount`, {
            params: { province: apiName },
          });
          counts[destination.name] = response.data.count;
        } catch {
          counts[destination.name] = 0;
        }
      }
      setProvinceHotelCounts(counts);
    };
    fetchCounts();
  }, [destinations, backendUrl]);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto mt-12 px-4">
        {/* Tiêu đề và mô tả */}
        <h2 className="mt-8 text-3xl font-bold text-[#003b95] text-center mb-4">
          <FormattedMessage
            id="destinations.popular_destinations"
            defaultMessage="Địa Điểm Phổ Biến"
          />
        </h2>
        <p className="text-gray-600 text-center text-lg mb-17">
          <FormattedMessage
            id="destinations.explore_destinations"
            defaultMessage="Khám phá các điểm phổ biến tuyệt vời với giá tốt nhất cùng dịch vụ đặt phòng cao cấp của chúng tôi."
          />
        </p>

        {/* Grid địa điểm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => {
            // Map tên hiển thị sang tên API
            const provinceApiMap = {
              "Hà Nội": "Hanoi",
              "Hạ Long": "Ha Long",
              "Đà Nẵng": "Da Nang",
              "TP. Hồ Chí Minh": "Ho Chi Minh",
              "Phú Quốc": "Phu Quoc",
            };
            const provinceApiName = provinceApiMap[destination.name] || destination.name;
            return (
              <Link
                to={`/province/${provinceApiName}`}
                key={index}
                className="bg-white cursor-pointer shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl block"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    console.error(`Failed to load image: ${destination.image}`);
                    e.target.src = "https://via.placeholder.com/1200x400";
                  }}
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800">{destination.name}</h3>
                  <p className="text-gray-500 mt-2">{provinceHotelCounts[destination.name] ?? "..."} khách sạn</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DestinationsPage;