import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function HotelEditForm() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    road: "",
    province: "",
    description: "",
    rating: "",
    images: [], // new images
  });
  const [currentImages, setCurrentImages] = useState([]); // old images
  const [setDeletedImages] = useState([]); // links to delete
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch hotel info by id
    axios.get(`http://localhost/bookingBackend/api/hotel/get?id=${id}`)
      .then(res => {
        const hotel = res.data;
        setForm({
          name: hotel.name || "",
          road: hotel.address || "",
          province: hotel.province || "",
          description: hotel.description || "",
          rating: hotel.rating || "",
          images: [],
        });
        setCurrentImages(hotel.images || []);
      })
      .catch(() => setMessage("Không lấy được thông tin khách sạn"));
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "images") {
      setForm({ ...form, images: e.target.files });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleDeleteImage = (img) => {
    setDeletedImages((prev) => [...prev, img]);
    setCurrentImages((prev) => prev.filter((i) => i !== img));
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
    // KHÔNG gửi deleted_images[] => giữ lại toàn bộ ảnh cũ
    for (let i = 0; i < (form.images.length > 0 ? 1 : 0); i++) {
      formData.append("images[]", form.images[i]);
    }
    try {
      const res = await axios.post(
        `http://localhost/bookingBackend/api/hotel/update?id=${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message || "Cập nhật khách sạn thành công!");
      setTimeout(() => navigate("/dashboard/hotels"), 1500);
    } catch (error) {
        console.error("Error updating hotel:", error);
      setMessage("Cập nhật khách sạn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#003b95]">Sửa khách sạn</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tên khách sạn *</label>
        <input name="name" required className="w-full border rounded px-3 py-2" value={form.name} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Đường *</label>
        <input name="road" required className="w-full border rounded px-3 py-2" value={form.road} onChange={handleChange} />
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
        <textarea name="description" className="w-full border rounded px-3 py-2" value={form.description} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Rating</label>
        <input name="rating" type="number" min="0" max="5" step="0.1" className="w-full border rounded px-3 py-2" value={form.rating} onChange={handleChange} />
      </div>
      {/* Ảnh hiện tại */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Ảnh hiện tại</label>
        <div className="flex gap-2 flex-wrap">
          {currentImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={`http://localhost/bookingBackend/${img}`} alt="old" className="w-14 h-14 object-cover rounded border border-gray-300 shadow" />
              <button type="button" onClick={() => handleDeleteImage(img)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow opacity-80 group-hover:opacity-100">×</button>
            </div>
          ))}
        </div>
      </div>
      {/* Ảnh mới */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Thêm ảnh mới</label>
        <div className="flex items-center gap-4 flex-wrap">
          <label htmlFor="images-upload" className="bg-[#febb02] text-white px-4 py-2 rounded cursor-pointer font-semibold shadow hover:bg-[#e0a800] transition">
            Chọn ảnh
          </label>
          <input
            id="images-upload"
            name="images"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-gray-600 text-sm">
            {form.images && form.images.length > 0 ? `${form.images.length} ảnh đã chọn` : "Chưa chọn ảnh mới"}
          </span>
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
        {loading ? "Đang cập nhật..." : "Cập nhật khách sạn"}
      </button>
      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </form>
  );
}

export default HotelEditForm;
