import React from 'react'
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e0e7ef] py-12">
      <div className="container mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-[#003b95] mb-4 text-center">Về Booking Hotel</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Booking Hotel là nền tảng đặt phòng khách sạn trực tuyến hàng đầu, giúp bạn dễ dàng tìm kiếm, so sánh và đặt phòng khách sạn trên khắp Việt Nam và thế giới.
        </p>
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="About Booking Hotel"
          className="rounded-xl w-full h-64 object-cover mb-8 shadow"
        />
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#003b95] mb-2">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-700">
            Chúng tôi mong muốn mang đến cho khách hàng trải nghiệm đặt phòng tiện lợi, nhanh chóng và an toàn nhất. Booking Hotel hợp tác với hàng nghìn khách sạn, resort, homestay uy tín để đảm bảo bạn luôn có nhiều lựa chọn phù hợp với nhu cầu và ngân sách.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#003b95] mb-2">Tại sao chọn Booking Hotel?</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Giao diện thân thiện, dễ sử dụng trên mọi thiết bị.</li>
            <li>So sánh giá và ưu đãi từ nhiều khách sạn chỉ với vài cú nhấp chuột.</li>
            <li>Đặt phòng nhanh chóng, xác nhận tức thì.</li>
            <li>Hỗ trợ khách hàng 24/7, sẵn sàng giải đáp mọi thắc mắc.</li>
            <li>Chính sách thanh toán linh hoạt, bảo mật thông tin tuyệt đối.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#003b95] mb-2">Đội ngũ của chúng tôi</h2>
          <p className="text-gray-700">
            Booking Hotel được xây dựng và phát triển bởi đội ngũ trẻ trung, năng động, đam mê công nghệ và du lịch. Chúng tôi luôn lắng nghe ý kiến đóng góp của khách hàng để không ngừng hoàn thiện sản phẩm.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#003b95] mb-2">Liên hệ với chúng tôi</h2>
          <p className="text-gray-700 mb-2">
            Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi:
          </p>
          <ul className="text-gray-700">
            <li>Email: <a href="mailto:support@bookinghotel.com" className="text-[#003b95] underline">support@bookinghotel.com</a></li>
            <li>Hotline: <a href="tel:18001234" className="text-[#003b95] underline">1800 1234</a></li>
            <li>Địa chỉ: 123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh</li>
          </ul>
        </section>
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-block bg-[#febb02] text-white font-bold px-6 py-3 rounded-full shadow hover:bg-[#e0a800] transition"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
