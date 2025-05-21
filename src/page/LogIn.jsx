import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/ContextData';

function LogIn() {
  const { setIsAuth } = useContext(AppContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost/bookingBackend/api/user/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role,
        }));
        localStorage.setItem('token', response.data.token);
        setIsAuth(true);
        navigate('/');
      } else {
        setError(response.data?.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Có lỗi xảy ra. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      <div className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#003b95] mb-2">Đăng nhập</h1>
          <p className="text-gray-500">Chào mừng bạn quay lại với Booking Hotel</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Mật khẩu</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#febb02] text-white font-bold cursor-pointer py-2 px-4 rounded-lg hover:bg-[#e0a800] transition disabled:bg-gray-400"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="mt-6 flex justify-between text-sm">
          <Link to="/register" className="text-[#003b95] font-semibold hover:underline">Đăng ký</Link>
          <Link to="/forgot-password" className="text-[#003b95] font-semibold hover:underline">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
