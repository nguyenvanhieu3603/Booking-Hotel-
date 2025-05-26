import React from "react";
import { FormattedMessage } from "react-intl";
import { FaCrown } from "react-icons/fa";

function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="bg-gradient-to-br from-[#febb02]/90 to-[#003b95]/90 rounded-3xl shadow-2xl p-12 max-w-xl w-full text-center">
        <div className="flex justify-center mb-4">
          <span className="bg-white shadow-lg rounded-full p-4">
            <FaCrown className="text-[#febb02] text-4xl" />
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow">
          <FormattedMessage
            id="admin.welcome"
            defaultMessage="Chào mừng đến với Dashboard Admin"
          />
        </h2>
        <p className="text-lg text-white/90 font-medium">
          <FormattedMessage
            id="admin.select_option"
            defaultMessage="Vui lòng chọn một mục từ menu bên trái để quản lý."
          />
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
