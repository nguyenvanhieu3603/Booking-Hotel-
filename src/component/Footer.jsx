import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-gray-100 text-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage id="footer.support" defaultMessage="Hỗ trợ" />
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.support.covid_faq"
                    defaultMessage="Các câu hỏi thường gặp về virus corona (COVID-19)"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.support.manage_trips"
                    defaultMessage="Quản lí các chuyến đi của bạn"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.support.customer_service"
                    defaultMessage="Liên hệ Dịch vụ Khách hàng"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.support.security_center"
                    defaultMessage="Trung tâm thông tin bảo mật"
                  />
                </Link >
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage
                id="footer.explore_more"
                defaultMessage="Khám phá thêm"
              />
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.genius_program"
                    defaultMessage="Chương trình khách hàng thân thiết Genius"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.seasonal_offers"
                    defaultMessage="Ưu đãi theo mùa và dịp lễ"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.travel_articles"
                    defaultMessage="Bài viết về du lịch"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.business"
                    defaultMessage="Booking.com dành cho Doanh Nghiệp"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.awards"
                    defaultMessage="Traveller Review Awards"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.car_rental"
                    defaultMessage="Cho thuê xe hơi"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.flights"
                    defaultMessage="Tìm chuyến bay"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.restaurant_booking"
                    defaultMessage="Đặt nhà hàng"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.explore_more.agency"
                    defaultMessage="Booking.com dành cho Đại Lý Du Lịch"
                  />
                </Link >
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage
                id="footer.terms"
                defaultMessage="Điều khoản và cài đặt"
              />
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.terms.privacy_cookie"
                    defaultMessage="Bảo mật & Cookie"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.terms.terms_conditions"
                    defaultMessage="Điều khoản và điều kiện"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.terms.partner_disputes"
                    defaultMessage="Tranh chấp đối tác"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.terms.modern_slavery"
                    defaultMessage="Chính sách chống Nô lệ Hiện đại"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.terms.human_rights"
                    defaultMessage="Chính sách về Quyền con người"
                  />
                </Link >
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage
                id="footer.for_partners"
                defaultMessage="Dành cho đối tác"
              />
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.for_partners.extranet_login"
                    defaultMessage="Đăng nhập vào trang Extranet"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.for_partners.partner_help"
                    defaultMessage="Trợ giúp đối tác"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.for_partners.list_property"
                    defaultMessage="Đăng chỗ nghỉ của Quý vị"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.for_partners.become_partner"
                    defaultMessage="Trở thành đối tác phân phối"
                  />
                </Link >
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage
                id="footer.about_us"
                defaultMessage="Về chúng tôi"
              />
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.about_us.about_booking"
                    defaultMessage="Về Booking.com"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.about_us.how_we_work"
                    defaultMessage="Chúng tôi hoạt động như thế nào"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.about_us.sustainable_travel"
                    defaultMessage="Du lịch bền vững"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.about_us.press"
                    defaultMessage="Truyền thông"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.about_us.careers"
                    defaultMessage="Cơ hội việc làm"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.about_us.investor_relations"
                    defaultMessage="Quan hệ cổ đông"
                  />
                </Link >
              </li>
              <li>
                <Link to={"/"} >
                  <FormattedMessage
                    id="footer.about_us.contact_company"
                    defaultMessage="Liên hệ công ty"
                  />
                </Link >
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm">
          <p>&copy; 1996 - 2025 Booking.com™. Bảo lưu mọi quyền.</p>
          <p className="mt-2">
            Booking.com là một phần của Booking Holdings Inc., tập đoàn đứng đầu
            thế giới về du lịch trực tuyến và các dịch vụ liên quan.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
