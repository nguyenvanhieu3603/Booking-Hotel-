import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success hoặc error

  // Tự động xóa thông báo sau 5 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setMessage(''); // Xóa thông báo cũ trước khi kiểm tra
    setMessageType('');

    // Kiểm tra email rỗng hoặc định dạng không hợp lệ
    if (!email) {
      setMessage('Email không được để trống!');
      setMessageType('error');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Vui lòng nhập email đúng định dạng (ví dụ: user@example.com)!');
      setMessageType('error');
      return;
    }

    // Giả lập kiểm tra email tồn tại (thay bằng API call thực tế)
    const validEmails = ['user@example.com']; // Danh sách email hợp lệ mẫu
    if (!validEmails.includes(email)) {
      setMessage('Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc đăng ký mới!');
      setMessageType('error');
      return;
    }

    // Giả lập gửi email và hiển thị thông báo thành công
    setMessage('Liên kết đặt lại mật khẩu đã được gửi tới email của bạn.');
    setMessageType('success');
    // Ở đây sẽ gọi API để gửi email thực tế
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      <div className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#003b95] mb-2">Quên mật khẩu</h1>
          <p className="text-gray-500">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
        </div>
        <form className="space-y-6" onSubmit={handleForgotPassword}>
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
          {message && (
            <p className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[#febb02] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition"
          >
            Gửi yêu cầu đặt lại mật khẩu
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-[#003b95] font-semibold hover:underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;