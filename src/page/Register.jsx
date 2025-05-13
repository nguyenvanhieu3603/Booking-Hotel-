import React from 'react';
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      <div className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#003b95] mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-500">Tạo tài khoản để trải nghiệm dịch vụ tốt nhất từ Booking Hotel</p>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Họ và tên</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#003b95]">Mật khẩu</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#febb02] focus:border-[#003b95] focus:outline-none"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#febb02] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition"
          >
            Đăng ký
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