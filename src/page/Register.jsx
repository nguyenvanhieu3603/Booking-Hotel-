import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setPasswordError('');
    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost/bookingBackend/api/user/register', {
        fullName,
        email,
        password,
        phone
      });

      if (res.data.success) {
        setMessage(res.data.message || "Đăng ký thành công.");
        setIsSuccess(true);
        setRegisteredEmail(email);
        if (res.data.requires_verification) {
          setShowOtpModal(true);
        } else {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        setMessage(res.data.error || "Đăng ký thất bại.");
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra. Vui lòng thử lại."
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    try {
      const res = await axios.post('http://localhost/bookingBackend/api/otp/verify', {
        email: registeredEmail,
        otp
      });
      if (res.data.success) {
        setShowOtpModal(false);
        setTimeout(() => {
          alert("Xác minh thành công. Bạn có thể đăng nhập ngay bây giờ.");
          navigate("/login");
        }, 500);
      } else {
        setOtpError(res.data.error || "OTP không đúng. Vui lòng thử lại.");
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#e9e6e6] bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <h2 className="text-xl font-bold mb-4 text-[#003b95]">Xác minh OTP</h2>
            <p className="mb-4 text-gray-600 text-sm">Vui lòng nhập mã OTP 6 số đã được gửi đến email của bạn.</p>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                maxLength={6}
                pattern="\d{6}"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
                placeholder="Nhập OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/,''))}
                required
              />
              {otpError && <div className="text-red-600 text-sm mb-2">{otpError}</div>}
              <button
                type="submit"
                className="w-full bg-[#febb02] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition"
              >
                Xác minh
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#003b95] mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-500">Tạo tài khoản để trải nghiệm dịch vụ tốt nhất từ Booking Hotel</p>
        </div>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Họ và tên</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Nhập lại mật khẩu</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && (
              <div className="text-red-600 text-sm mt-1">{passwordError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Số điện thoại</label>
            <input
              type="tel"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          {message && (
            <div className={`text-sm text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}>{message}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#febb02] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <Link to="/login" className="text-[#003b95] font-semibold hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;