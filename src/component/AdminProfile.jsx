import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";
import axios from "axios";

function AdminProfile() {
  const { setIsAuth } = useContext(AppContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });

  // Lấy thông tin cá nhân từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost/bookingBackend/api/user/profile", {
          withCredentials: true,
        });
        setProfile(response.data);
        setFormData({
          fullName: response.data.fullName,
          phone: response.data.phone || "",
        });
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Có lỗi xảy ra khi tải thông tin cá nhân"
        );
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    navigate("/login");
  };

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý gửi form chỉnh sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost/bookingBackend/api/user/update",
        formData,
        { withCredentials: true }
      );
      setProfile(response.data.user);
      setFormData({
        fullName: response.data.user.fullName,
        phone: response.data.user.phone || "",
      });
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Có lỗi xảy ra khi cập nhật thông tin"
      );
    }
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
                  className="flex items-center w-full p-3 rounded-lg bg-[#febb02] text-white transition"
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
              <FaUserCircle className="mr-2" />
              <FormattedMessage id="admin.profile" defaultMessage="Thông tin cá nhân" />
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {loading ? (
                <div className="text-gray-700">Đang tải...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : profile ? (
                <>
                  {!isEditing ? (
                    <div className="space-y-4 text-[#003b95]">
                      <div className="flex items-center">
                        <span className="font-semibold w-32">ID:</span>
                        <span>{profile.id}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-32">Họ tên:</span>
                        <span>{profile.fullName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-32">Email:</span>
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-32">Số điện thoại:</span>
                        <span>{profile.phone || "Chưa cập nhật"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-32">Vai trò:</span>
                        <span>{profile.role}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold w-32">Ngày tạo:</span>
                        <span>{profile.createdAt}</span>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-[#febb02] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#e0a800] transition"
                        >
                          <FormattedMessage id="admin.edit_profile" defaultMessage="Chỉnh sửa thông tin" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[#003b95] font-semibold">Họ tên</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#003b95] font-semibold">Số điện thoại</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95]"
                          required
                        />
                      </div>
                      {error && <div className="text-red-500">{error}</div>}
                      <div className="mt-6 flex space-x-4">
                        <button
                          type="submit"
                          className="bg-[#febb02] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#e0a800] transition"
                        >
                          <FormattedMessage id="admin.save" defaultMessage="Lưu" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                          <FormattedMessage id="admin.cancel" defaultMessage="Hủy" />
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;