import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/ContextData';

function Login() {
  const { accountLogIn, setIsAuth } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if(email == accountLogIn[0].tk && password == accountLogIn[0].mk) {
      localStorage.setItem('isAuth', 'true');
      setIsAuth(true);
      navigate('/');
    } else {
      alert('Tài khoản hoặc mật khẩu không đúng!');
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#febb02] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link to="/register" className="text-[#003b95] font-semibold hover:underline">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
