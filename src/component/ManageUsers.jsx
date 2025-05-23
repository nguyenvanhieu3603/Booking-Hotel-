import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaHotel, FaCalendarCheck, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AppContext } from "../context/ContextData";
import Header from "../component/Header";
import { FormattedMessage } from "react-intl";
import axios from "axios";

function ManageUsers() {
  const { setIsAuth } = useContext(AppContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    phone: "",
    role: "customer",
  });

  // Lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost/bookingBackend/api/user/list", {
          withCredentials: true,
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Có lỗi xảy ra khi tải danh sách người dùng"
        );
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Xử lý xóa người dùng
  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete("http://localhost/bookingBackend/api/user/delete", {
        data: { userId },
        withCredentials: true,
      });
      setUsers(users.filter((user) => user.id !== userId));
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Có lỗi xảy ra khi xóa người dùng"
      );
    }
  };

  // Xử lý chỉnh sửa người dùng
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      userId: user.id,
      fullName: user.fullName,
      phone: user.phone || "",
      role: user.role,
    });
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
        "http://localhost/bookingBackend/api/user/admin-update",
        formData,
        { withCredentials: true }
      );
      setUsers(
        users.map((user) =>
          user.id === formData.userId ? response.data.user : user
        )
      );
      setEditingUser(null);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Có lỗi xảy ra khi cập nhật người dùng"
      );
    }
  };

  // Xử lý đăng xuất
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
                  className="flex items-center w-full p-3 rounded-lg bg-[#febb02] text-white transition"
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
            <h2 className="text-2xl font-bold text-[#003b95] mb-6 flex items-center">
              <FaUsers className="mr-2" />
              <FormattedMessage id="admin.users" defaultMessage="Quản lý người dùng" />
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="p-4 text-gray-700">Đang tải...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : users.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-[#f8fafc]">
                    <tr>
                      <th className="p-4 text-[#003b95] font-semibold">ID</th>
                      <th className="p-4 text-[#003b95] font-semibold">Họ tên</th>
                      <th className="p-4 text-[#003b95] font-semibold">Email</th>
                      <th className="p-4 text-[#003b95] font-semibold">Vai trò</th>
                      <th className="p-4 text-[#003b95] font-semibold">Ngày tạo</th>
                      <th className="p-4 text-[#003b95] font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">{user.id}</td>
                        <td className="p-4">{user.fullName}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.role}</td>
                        <td className="p-4">{user.createdAt}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-[#febb02] hover:underline"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-500 hover:underline ml-2"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-gray-700">Không có người dùng nào</div>
              )}
            </div>
            {editingUser && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#003b95] mb-4">
                  <FormattedMessage id="admin.edit_user" defaultMessage="Chỉnh sửa người dùng" />
                </h3>
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
                  <div>
                    <label className="block text-[#003b95] font-semibold">Vai trò</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95]"
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Admin</option>
                    </select>
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
                      onClick={() => setEditingUser(null)}
                      className="bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      <FormattedMessage id="admin.cancel" defaultMessage="Hủy" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;