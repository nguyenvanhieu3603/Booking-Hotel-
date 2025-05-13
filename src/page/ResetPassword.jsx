import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Giả lập token từ liên kết

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Kiểm tra token hết hạn hoặc không hợp lệ (giả lập)
    if (!token) {
      setMessage('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại yêu cầu!');
      return;
    }

    // Kiểm tra độ mạnh mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!');
      return;
    }

    // Kiểm tra trùng khớp
    if (password !== confirmPassword) {
      setMessage('Mật khẩu nhập lại không khớp!');
      return;
    }

    // Giả lập cập nhật mật khẩu thành công (thay bằng API call thực tế)
    setMessage('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
    setTimeout(() => navigate('/login'), 2000); // Chuyển hướng sau 2 giây
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      <div className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#003b95] mb-2">Đặt lại mật khẩu</h1>
          <p className="text-gray-500">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>
        <form className="space-y-6" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Mật khẩu mới</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {message && (
            <p className={`text-sm ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#febb02] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition"
          >
            Cập nhật mật khẩu
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-[#003b95] font-semibold hover:underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;