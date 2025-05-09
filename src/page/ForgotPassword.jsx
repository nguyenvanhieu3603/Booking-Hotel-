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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-lg shadow-2xl w-96">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Quên mật khẩu</h1>
        </div>
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Gửi yêu cầu đặt lại mật khẩu
          </button>
        </form>
        <div className="mt-6 flex justify-between text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;