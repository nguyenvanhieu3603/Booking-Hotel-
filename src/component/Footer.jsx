import React from 'react'

function Footer() {
  return (
    <div className="bg-gray-100 text-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Hỗ trợ</h3>
            <ul className="space-y-1 text-sm">
              <li>Các câu hỏi thường gặp về virus corona (COVID-19)</li>
              <li>Quản lí các chuyến đi của bạn</li>
              <li>Liên hệ Dịch vụ Khách hàng</li>
              <li>Trung tâm thông tin bảo mật</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Khám phá thêm</h3>
            <ul className="space-y-1 text-sm">
              <li>Chương trình khách hàng thân thiết Genius</li>
              <li>Ưu đãi theo mùa và dịp lễ</li>
              <li>Bài viết về du lịch</li>
              <li>Booking.com dành cho Doanh Nghiệp</li>
              <li>Traveller Review Awards</li>
              <li>Cho thuê xe hơi</li>
              <li>Tìm chuyến bay</li>
              <li>Đặt nhà hàng</li>
              <li>Booking.com dành cho Đại Lý Du Lịch</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Điều khoản và cài đặt</h3>
            <ul className="space-y-1 text-sm">
              <li>Bảo mật & Cookie</li>
              <li>Điều khoản và điều kiện</li>
              <li>Tranh chấp đối tác</li>
              <li>Chính sách chống Nô lệ Hiện đại</li>
              <li>Chính sách về Quyền con người</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Dành cho đối tác</h3>
            <ul className="space-y-1 text-sm">
              <li>Đăng nhập vào trang Extranet</li>
              <li>Trợ giúp đối tác</li>
              <li>Đăng chỗ nghỉ của Quý vị</li>
              <li>Trở thành đối tác phân phối</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Về chúng tôi</h3>
            <ul className="space-y-1 text-sm">
              <li>Về Booking.com</li>
              <li>Chúng tôi hoạt động như thế nào</li>
              <li>Du lịch bền vững</li>
              <li>Truyền thông</li>
              <li>Cơ hội việc làm</li>
              <li>Quan hệ cổ đông</li>
              <li>Liên hệ công ty</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm">
          <p>&copy; 1996 - 2025 Booking.com™. Bảo lưu mọi quyền.</p>
          <p className="mt-2">Booking.com là một phần của Booking Holdings Inc., tập đoàn đứng đầu thế giới về du lịch trực tuyến và các dịch vụ liên quan.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
