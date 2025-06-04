import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HotelCreateForm() {
  const [form, setForm] = useState({
    name: "",
    road: "",
    province: "",
    description: "",
    rating: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "images") {
      setForm({ ...form, images: e.target.files });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("road", form.road);
    formData.append("province", form.province);
    if (form.description) formData.append("description", form.description);
    if (form.rating) formData.append("rating", form.rating);
    for (let i = 0; i < form.images.length; i++) {
      formData.append("images[]", form.images[i]);
    }
    try {
      const res = await axios.post(
        "http://localhost/bookingBackend/api/hotel/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message || "Tạo khách sạn thành công!");
      setTimeout(() => navigate("/dashboard/hotels"), 1500);
    } catch (error) {
        console.error("Error creating hotel:", error);
      setMessage("Tạo khách sạn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#003b95]">Thêm khách sạn mới</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tên khách sạn *</label>
        <input name="name" required className="w-full border rounded px-3 py-2" onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Đường *</label>
        <input name="road" required className="w-full border rounded px-3 py-2" onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tỉnh/Thành *</label>
        <select
          name="province"
          required
          className="w-full border rounded px-3 py-2"
          value={form.province}
          onChange={handleChange}
        >
          <option value="">-- Chọn tỉnh/thành --</option>
          <option value="HaNoi">Hà Nội</option>
          <option value="DaNang">Đà Nẵng</option>
          <option value="PhuQuoc">Phú Quốc</option>
          <option value="HCM">TP. Hồ Chí Minh</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Mô tả</label>
        <textarea name="description" className="w-full border rounded px-3 py-2" onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Rating</label>
        <input name="rating" type="number" min="0" max="5" step="0.1" className="w-full border rounded px-3 py-2" onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Ảnh (có thể chọn nhiều)</label>
        <div className="flex items-center gap-4 flex-wrap">
          <label htmlFor="images-upload" className="bg-[#febb02] text-white px-4 py-2 rounded cursor-pointer font-semibold shadow hover:bg-[#e0a800] transition">
            Chọn ảnh
          </label>
          <input
            id="images-upload"
            name="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-gray-600 text-sm">
            {form.images && form.images.length > 0 ? `${form.images.length} ảnh đã chọn` : "Chưa chọn ảnh nào"}
          </span>
          {/* Hiển thị ảnh nhỏ */}
          {form.images && form.images.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {Array.from(form.images).map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className="w-14 h-14 object-cover rounded border border-gray-300 shadow"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <button type="submit" disabled={loading} className="bg-[#febb02] text-white font-bold px-6 py-2 rounded hover:bg-[#e0a800]">
        {loading ? "Đang tạo..." : "Tạo khách sạn"}
      </button>
      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </form>
  );
}

export default HotelCreateForm;
