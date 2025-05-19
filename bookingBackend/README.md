# Hệ Thống Đặt Phòng Khách Sạn - Backend API

Đây là tài liệu hướng dẫn sử dụng API cho hệ thống đặt phòng khách sạn. API được xây dựng bằng PHP, chạy trên XAMPP, và sử dụng MySQL để lưu trữ dữ liệu. Tài liệu này liệt kê tất cả các endpoint hiện có, bao gồm phương thức HTTP, URL, body yêu cầu, response mẫu, và các lưu ý quan trọng.

## Thiết Lập Môi Trường

1. **Yêu cầu**:

   - [XAMPP](https://www.apachefriends.org/download.html) (Apache, MySQL, PHP)

   - [Composer](https://getcomposer.org/download/) để quản lý các dependency PHP

2. **Cài đặt**:

   - Clone hoặc giải nén mã nguồn vào thư mục `htdocs/bookingBackend`.
     <img src="img\Untitled.png" alt="Img" width="1000px"/>

   

     - Cài đặt database:

     * Tạo database mới trong xampp,đặt tên hotel_booking
     * Chọn tab SQL,paste toàn bộ nội dung trong hotel_booking (1).sql vào ,ấn Go
       <img src="img\Untitled2.png" alt="htaccess" width="1000px"/>

3. **Khởi động**:

   - Bật Apache và MySQL trong XAMPP.

## Danh Sách Endpoint

### 1. Đăng Ký Người Dùng

- **Chức năng**: Tạo tài khoản mới cho người dùng (vai trò `customer`).

- **Phương thức**: POST

- **URL**: `http://localhost/bookingBackend/api/user/register`

- **Body** (JSON):

  ```json
  {
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "Password123!",
    "phone": "0323456789"
  }
  ```

  - `fullName`: Họ và tên (bắt buộc, không rỗng, tối đa 255 ký tự).
  - `email`: Email hợp lệ (bắt buộc, định dạng email, duy nhất trong hệ thống).
  - `password`: Mật khẩu (bắt buộc, ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt).
  - `phone`: Số điện thoại Việt Nam (bắt buộc, định dạng `0[1-9][0-9]{8}`).

- **Response mẫu** (thành công):

  ```json
  {
    "id": 8,
    "message": "Đăng ký thành công. Vui lòng kiểm tra email để nhận OTP xác minh.",
    "requires_verification": true,
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng các trường bắt buộc.
    - Email không đúng định dạng (ví dụ: thiếu `@` hoặc tên miền không hợp lệ).
    - Mật khẩu không đủ mạnh (thiếu chữ hoa, số, hoặc ký tự đặc biệt).
    - Số điện thoại không đúng định dạng (phải bắt đầu bằng 0, theo sau là 9 số).
    - Email đã được đăng ký bởi người dùng khác.
  - `422 Không Thể Xử Lý`: Phương thức HTTP không phải POST.
  - `500 Lỗi Máy Chủ`: Lỗi gửi email OTP hoặc lỗi cơ sở dữ liệu.

- **Lưu ý**:

  - Email phải là email thật và có thể nhận được email để nhận OTP xác minh.
  - OTP được gửi qua email từ tài khoản SMTP cấu hình trong `EmailService.php`.
  - Kiểm tra thư mục spam/junk nếu không nhận được email OTP.
  - Tài khoản mới tạo có vai trò `customer` và `is_verified = FALSE` cho đến khi xác minh OTP.
  - Nếu không nhận được OTP, sử dụng endpoint `/api/otp/send` để gửi lại.
  - Hiện tại OTP không có thời hạn để test; nên khôi phục thời hạn (ví dụ: 15 phút) sau khi test.

### 2. Gửi Lại OTP

- **Chức năng**: Gửi lại mã OTP để xác minh tài khoản nếu người dùng chưa nhận được email hoặc quên OTP.

- **Phương thức**: POST

- **URL**: `http://localhost/bookingBackend/api/otp/send`

- **Body** (JSON):

  ```json
  {
    "email": "user@example.com"
  }
  ```

  - `email`: Email đã đăng ký (bắt buộc).

- **Response mẫu** (thành công):

  ```json
  {
    "message": "OTP đã được gửi lại tới email của bạn",
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng `email`.
    - Email không đúng định dạng.
    - Email không tồn tại trong hệ thống.
    - Tài khoản đã được xác minh (`is_verified = TRUE`).
  - `422 Không Thể Xử Lý`: Phương thức không phải POST.
  - `500 Lỗi Máy Chủ`: Lỗi gửi email OTP.

- **Lưu ý**:

  - Chức năng này dùng để gửi lại OTP trong trường hợp:
    - Người dùng không nhận được email xác thực ban đầu.
    - Người dùng quên mã OTP đã nhận.
  - Chỉ áp dụng cho tài khoản chưa xác minh (`is_verified = FALSE`).
  - OTP mới sẽ ghi đè OTP cũ trong cơ sở dữ liệu.
  - Kiểm tra thư mục spam/junk nếu không nhận được email.
  - Nên giới hạn số lần gửi OTP (ví dụ: 5 lần/giờ) để tránh lạm dụng (hiện chưa triển khai).

### 3. Xác Minh OTP

- **Chức năng**: Xác minh tài khoản người dùng bằng OTP gửi qua email sau khi đăng ký.

- **Phương thức**: POST

- **URL**: `http://localhost/bookingBackend/api/otp/verify`

- **Body** (JSON):

  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```

  - `email`: Email đã đăng ký (bắt buộc).
  - `otpCode`: Mã OTP 6 chữ số nhận được qua email (bắt buộc).

- **Response mẫu** (thành công):

  ```json
  {
    "message": "Xác minh tài khoản thành công. Bạn có thể đăng nhập.",
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng `email`/`otpCode`.
    - Email không tồn tại.
    - OTP không chính xác.
    - Tài khoản đã được xác minh.
  - `422 Không Thể Xử Lý`: Phương thức không phải POST.

- **Lưu ý**:

  - Sau khi xác minh, trường `is_verified` trong bảng `users` được đặt thành `TRUE`, và `otp_code` bị xóa.
  - OTP hiện không có thời hạn để test; nên khôi phục thời hạn (ví dụ: 15 phút) sau khi test.
  - Nếu OTP không đúng, người dùng có thể yêu cầu gửi lại OTP qua `/api/otp/send`.
  - Chỉ tài khoản chưa xác minh mới cần gọi endpoint này.

### 4. Đăng Nhập

- **Chức năng**: Đăng nhập người dùng (customer hoặc admin) và trả về JWT.
- **Phương thức**: POST
- **URL**: `http://localhost/bookingBackend/api/user/login`
- **Body** (JSON):

  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```

  - `email`: Email đã đăng ký (bắt buộc).
  - `password`: Mật khẩu (bắt buộc).

- **Response mẫu** (thành công):

  ```json
  {
    "id": 8,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0323456789",
    "role": "customer",
    "token": "<jwt_token>",
    "message": "Đăng nhập thành công",
    "success": true
  }
  ```

- **Response lỗi**:
  - `401 Không Được Phép`:
    - Thiếu hoặc rỗng `email`/`password`.
    - Email không tồn tại.
    - Mật khẩu không chính xác.
    - Tài khoản chưa xác minh (`is_verified = FALSE`).
    - Tài khoản bị khóa (`lockout_until` chưa hết).
  - `422 Không Thể Xử Lý`: Phương thức không phải POST.
- **Lưu ý**:
  - JWT được lưu trong cookie `jwt` (HttpOnly, SameSite=Strict, hết hạn sau 30 ngày).
  - Sau 5 lần đăng nhập sai, tài khoản bị khóa 15 phút (kiểm tra `failed_login_attempts` và `lockout_until`).
  - Tài khoản phải được xác minh (`is_verified = TRUE`) trước khi đăng nhập.
  - JWT cần được gửi trong cookie cho các endpoint yêu cầu xác thực (`/profile`, `/update`, `/list`, `/adminUpdate`, `/delete`).
  - Nếu quên mật khẩu, sử dụng endpoint `/api/user/forgotpassword`.

### 5. Đăng Xuất

- **Chức năng**: Đăng xuất người dùng, xóa cookie JWT.

- **Phương thức**: POST

- **URL**: `http://localhost/bookingBackend/api/user/logout`

- **Body**: Không cần body.

- **Response mẫu** (thành công):

  ```json
  {
    "message": "Đăng xuất thành công",
    "success": true
  }
  ```

- **Response lỗi**: Không có (luôn trả về 200 nếu gọi đúng).

- **Lưu ý**:

  - Xóa cookie `jwt` trong trình duyệt, khiến các endpoint yêu cầu xác thực trả về lỗi `401`.
  - Không yêu cầu xác thực, có thể gọi bất kỳ lúc nào.
  - Đảm bảo gọi endpoint này khi người dùng muốn kết thúc phiên đăng nhập để tăng cường bảo mật.

### 6. Xem Thông Tin Cá Nhân

- **Chức năng**: Lấy thông tin cá nhân của người dùng đang đăng nhập.

- **Phương thức**: GET

- **URL**: `http://localhost/bookingBackend/api/user/profile`


- **Body**: Không cần body.

- **Response mẫu** (thành công):

  ```json
  {
    "id": 8,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0323456789",
    "role": "customer",
    "createdAt": "2025-05-19 16:42:41"
  }
  ```

- **Response lỗi**:

  - `401 Không Được Phép`: Thiếu hoặc JWT không hợp lệ.
  - `404 Không Tìm Thấy`: Người dùng không tồn tại (hiếm, do JWT đã xác minh `userId`).
  - `422 Không Thể Xử Lý`: Phương thức không phải GET.

- **Lưu ý**:

  - Yêu cầu JWT hợp lệ trong cookie, lấy từ `/api/user/login`.
  - Chỉ trả về thông tin của người dùng đang đăng nhập, không thể xem thông tin người khác.
  - Dùng endpoint này để hiển thị hồ sơ người dùng trên giao diện frontend.
  - Nếu cần cập nhật thông tin, sử dụng `/api/user/update`.

### 7. Cập Nhật Thông Tin Cá Nhân

- **Chức năng**: Cập nhật thông tin cá nhân (`fullName`, `phone`) của người dùng đang đăng nhập.

- **Phương thức**: PUT

- **URL**: `http://localhost/bookingBackend/api/user/update`

- **Headers**:

  - `Cookie: jwt=<token>`

- **Body** (JSON):

  ```json
  {
    "fullName": "Nguyễn Văn A Updated",
    "phone": "0987654321"
  }
  ```

  - `fullName`: Họ và tên mới (bắt buộc, không rỗng, tối đa 255 ký tự).
  - `phone`: Số điện thoại mới (bắt buộc, định dạng Việt Nam `0[1-9][0-9]{8}`).

- **Response mẫu** (thành công):

  ```json
  {
    "message": "Cập nhật thông tin thành công",
    "user": {
      "id": 8,
      "fullName": "Nguyễn Văn A Updated",
      "email": "user@example.com",
      "phone": "0987654321",
      "role": "customer",
      "createdAt": "2025-05-19 16:42:41"
    },
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng `fullName`/`phone`.
    - Số điện thoại không đúng định dạng.
    - Không có thay đổi nào được thực hiện (dữ liệu gửi lên giống hệt dữ liệu hiện tại).
  - `401 Không Được Phép`: Thiếu hoặc JWT không hợp lệ.
  - `422 Không Thể Xử Lý`: Phương thức không phải PUT.

- **Lưu ý**:

  - Email không thể thay đổi để đơn giản hóa quy trình OTP và quên mật khẩu.
  - Chỉ người dùng đang đăng nhập mới có thể cập nhật thông tin của chính họ.
  - Admin không sử dụng endpoint này để cập nhật thông tin người dùng khác (dùng `/api/user/adminUpdate` thay thế).
  - Nếu cần thay đổi mật khẩu, sử dụng `/api/user/forgotpassword` và `/api/user/resetpassword`.

### 8. Quên Mật Khẩu

- **Chức năng**: Gửi liên kết đặt lại mật khẩu qua email.

- **Phương thức**: POST

- **URL**: `http://localhost/bookingBackend/api/user/forgotpassword`

- **Body** (JSON):

  ```json
  {
    "email": "user@example.com"
  }
  ```

  - `email`: Email đã đăng ký (bắt buộc).

- **Response mẫu** (thành công):

  ```json
  {
    "message": "Liên kết đặt lại mật khẩu đã được gửi tới email của bạn",
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng `email`.
    - Email không đúng định dạng.
    - Email không tồn tại trong hệ thống.
    - Không thể gửi email do lỗi SMTP.
  - `422 Không Thể Xử Lý`: Phương thức không phải POST.

- **Lưu ý**:

  - Email chứa liên kết đặt lại mật khẩu (dạng `http://localhost:5173/reset-password?token=<token>`).
  - Token hiện không có thời hạn để test; nên khôi phục thời hạn (ví dụ: 15 phút) sau khi test.
  - Kiểm tra thư mục spam/junk nếu không nhận được email.
  - Liên kết chỉ hoạt động một lần; sau khi đặt lại mật khẩu, token sẽ bị xóa.
  - Nếu người dùng không nhận được email, kiểm tra cấu hình SMTP trong `EmailService.php` hoặc liên hệ quản trị viên.

### 9. Đặt Lại Mật Khẩu

- **Chức năng**: Đặt lại mật khẩu bằng token từ email.

- **Phương thức**: POST

- **URL**: `http://localhost/bookingBackend/api/user/resetpassword`

- **Body** (JSON):

  ```json
  {
    "token": "example_reset_token_1234567890abcdef",
    "password": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }
  ```

  - `token`: Token từ email (bắt buộc).
  - `password`: Mật khẩu mới (bắt buộc, ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt).
  - `confirmPassword`: Xác nhận mật khẩu mới (bắt buộc, phải khớp với `password`).

- **Response mẫu** (thành công):

  ```json
  {
    "message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới",
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng `token`/`password`/`confirmPassword`.
    - Mật khẩu xác nhận không khớp.
    - Mật khẩu không đủ mạnh.
    - Token không hợp lệ hoặc đã được sử dụng.
  - `422 Không Thể Xử Lý`: Phương thức không phải POST.

- **Lưu ý**:

  - Token được tạo từ endpoint `/api/user/forgotpassword` và chỉ dùng được một lần.
  - Sau khi đặt lại mật khẩu, token bị xóa khỏi cơ sở dữ liệu (`reset_token` và `reset_token_expires_at` đặt thành `NULL`).
  - Nếu token không hợp lệ, người dùng phải yêu cầu liên kết mới qua `/api/user/forgotpassword`.
  - Đảm bảo mật khẩu mới khác mật khẩu cũ để tăng cường bảo mật.

### 10. Lấy Danh Sách Người Dùng (Admin)

- **Chức năng**: Lấy danh sách tất cả người dùng, chỉ dành cho admin.

- **Phương thức**: GET

- **URL**: `http://localhost/bookingBackend/api/user/list?limit=10`

- **Headers**:

  - `Cookie: jwt=<token>`

- **Query Parameters**:

  - `limit` (tùy chọn): Số lượng bản ghi tối đa (mặc định: 10, tối đa tùy thuộc cấu hình server).

- **Body**: Không cần body.

- **Response mẫu** (thành công):

  ```json
  [
    {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com",
      "phone": "0323456789",
      "role": "customer",
      "createdAt": "2025-05-19 16:42:41"
    },
    {
      "id": 3,
      "fullName": "Trần Văn C",
      "email": "admin@example.com",
      "phone": "0123456789",
      "role": "admin",
      "createdAt": "2025-05-15 18:19:10"
    }
  ]
  ```

- **Response lỗi**:

  - `401 Không Được Phép`: Thiếu hoặc JWT không hợp lệ.
  - `403 Cấm`: Người dùng không có vai trò `admin`.
  - `500 Lỗi Máy Chủ`: Lỗi truy vấn cơ sở dữ liệu (ví dụ: bảng `users` không tồn tại).
  - `422 Không Thể Xử Lý`: Phương thức không phải GET.

- **Lưu ý**:

  - Yêu cầu vai trò `admin`, xác minh qua JWT.
  - Dùng để quản lý người dùng trên giao diện admin (ví dụ: hiển thị danh sách khách hàng hoặc admin).
  - Tham số `limit` giúp giới hạn số bản ghi trả về để tối ưu hiệu suất.
  - Không trả về thông tin nhạy cảm như `password`, `otp_code`, hoặc `reset_token`.
  - Nếu danh sách trống, trả về mảng rỗng `[]`.

### 11. Cập Nhật Thông Tin Người Dùng (Admin)

- **Chức năng**: Admin cập nhật thông tin của người dùng (`fullName`, `phone`, `role`).

- **Phương thức**: PUT

- **URL**: `http://localhost/bookingBackend/api/user/adminUpdate`

- **Headers**:

  - `Cookie: jwt=<token>`

- **Body** (JSON):

  ```json
  {
    "userId": 7,
    "fullName": "Trần Văn A Updated",
    "phone": "0987654321",
    "role": "customer"
  }
  ```

  - `userId`: ID của người dùng cần cập nhật (bắt buộc, phải là số nguyên).
  - `fullName`: Họ và tên mới (bắt buộc, không rỗng, tối đa 255 ký tự).
  - `phone`: Số điện thoại mới (bắt buộc, định dạng Việt Nam `0[1-9][0-9]{8}`).
  - `role`: Vai trò mới (`admin` hoặc `customer`, bắt buộc).

- **Response mẫu** (thành công):

  ```json
  {
    "message": "Cập nhật thông tin người dùng thành công",
    "user": {
      "id": 7,
      "fullName": "Trần Văn A Updated",
      "email": "user@example.com",
      "phone": "0987654321",
      "role": "customer",
      "createdAt": "2025-05-19 16:42:41"
    },
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng các trường bắt buộc.
    - Số điện thoại không đúng định dạng.
    - Vai trò không hợp lệ (không phải `admin` hoặc `customer`).
    - Người dùng không tồn tại (`userId` không hợp lệ).
    - Không có thay đổi nào được thực hiện (dữ liệu gửi lên giống hệt dữ liệu hiện tại).
    - Cố gắng cập nhật thông tin của admin khác.
  - `401 Không Được Phép`: Thiếu hoặc JWT không hợp lệ.
  - `403 Cấm`: Người dùng không có vai trò `admin`.
  - `422 Không Thể Xử Lý`: Phương thức không phải PUT.

- **Lưu ý**:

  - Email không thể thay đổi để đơn giản hóa quy trình OTP và quên mật khẩu.
  - Admin không được cập nhật thông tin của admin khác để đảm bảo phân quyền.
  - Dùng endpoint này để thay đổi vai trò người dùng (từ `customer` sang `admin` hoặc ngược lại).
  - Kiểm tra kỹ `userId` để tránh cập nhật nhầm người dùng.
  - Nếu không có thay đổi (dữ liệu giống hệt), endpoint trả về lỗi để tránh cập nhật không cần thiết.

### 12. Xóa Người Dùng (Admin)

- **Chức năng**: Admin xóa một người dùng dựa trên `userId`.

- **Phương thức**: DELETE

- **URL**: `http://localhost/bookingBackend/api/user/delete`

- **Headers**:

  - `Cookie: jwt=<token>`

- **Body** (JSON):

  ```json
  {
    "userId": 7
  }
  ```

  - `userId`: ID của người dùng cần xóa (bắt buộc, phải là số nguyên).

- **Response mẫu** (thành công):

  ```json
  {
    "message": "Xóa người dùng thành công",
    "success": true
  }
  ```

- **Response lỗi**:

  - `400 Yêu Cầu Không Hợp Lệ`:
    - Thiếu hoặc rỗng `userId`.
    - Người dùng không tồn tại (`userId` không hợp lệ).
    - Cố gắng xóa chính mình.
    - Cố gắng xóa admin khác.
    - Xóa thất bại (ví dụ: lỗi cơ sở dữ liệu).
  - `401 Không Được Phép`: Thiếu hoặc JWT không hợp lệ.
  - `403 Cấm`: Người dùng không có vai trò `admin`.
  - `422 Không Thể Xử Lý`: Phương thức không phải DELETE.

- **Lưu ý**:

  - Yêu cầu vai trò `admin`, xác minh qua JWT.
  - Admin không được xóa chính mình để tránh mất quyền truy cập hệ thống.
  - Admin không được xóa admin khác để đảm bảo phân quyền.
  - Hiện tại chỉ xóa bản ghi trong bảng `users`; dữ liệu liên quan (như `bookings`, `reviews`) không bị xóa.
  - Nếu cần xóa dữ liệu liên quan, cần thêm logic vào `UserModel.php` (ví dụ: xóa `bookings` của người dùng).
  - Kiểm tra kỹ `userId` để tránh xóa nhầm người dùng.
  - Nên thêm xác nhận bổ sung (ví dụ: yêu cầu nhập mật khẩu admin) để tránh xóa ngẫu nhiên (hiện chưa triển khai).

## Các Lưu Ý Chung

1. **Xác Thực**:

   - Các endpoint `/profile`, `/update`, `/list`, `/adminUpdate`, `/delete` yêu cầu cookie `jwt` hợp lệ.
   - JWT được tạo khi đăng nhập, chứa `userId` và hết hạn sau 30 ngày.
   - Admin endpoint (`/list`, `/adminUpdate`, `/delete`) yêu cầu vai trò `admin`, kiểm tra qua `role` trong bảng `users`.
   - Nếu JWT hết hạn hoặc không hợp lệ, gọi lại `/api/user/login` để lấy JWT mới.

2. **Bảo Mật**:

   - Mật khẩu được băm bằng `password_hash` trước khi lưu vào cơ sở dữ liệu.
   - JWT sử dụng `HttpOnly`, `SameSite=Strict`, và `Secure` (trừ localhost) để ngăn truy cập trái phép.
   - Email không thể thay đổi để đơn giản hóa quy trình OTP và quên mật khẩu.
   - Admin không được cập nhật/xóa admin khác để tránh lạm quyền.
   - Hệ thống khóa tài khoản sau 5 lần đăng nhập sai (15 phút) để ngăn tấn công brute-force.

3. **Định Dạng Dữ Liệu**:

   - **Email**: Phải đúng định dạng (ví dụ: `user@example.com`), không chứa ký tự đặc biệt bất thường.
   - **Số điện thoại**: Định dạng Việt Nam (`0[1-9][0-9]{8}`), ví dụ: `0987654321`.
   - **Mật khẩu**: Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt (ví dụ: `@`, `#`, `!`).
   - **Vai trò**: Chỉ chấp nhận `admin` hoặc `customer`.
   - **userId**: Phải là số nguyên dương, tương ứng với `id` trong bảng `users`.

4. **Email**:

   - Sử dụng tài khoản SMTP cấu hình trong `EmailService.php` để gửi OTP và liên kết đặt lại mật khẩu.
   - Kiểm tra thư mục spam/junk hoặc cấu hình SMTP nếu không nhận được email.
   - Đảm bảo máy chủ SMTP (như Gmail) được cấu hình đúng với email và mật khẩu ứng dụng.
   - Nếu email không gửi được, kiểm tra log PHP (`C:\xampp\php\logs\php_error_log`) để xác định lỗi.

5. **Test**:

   - Sử dụng Postman hoặc công cụ tương tự để test API.

   - Đảm bảo server chạy trên `http://localhost/bookingBackend`.

   - Tạo tài khoản admin để test endpoint admin:

     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
     ```

   - Test các trường hợp lỗi (như nhập sai email, mật khẩu, OTP) để đảm bảo xử lý đúng.

   - Lưu ý gửi body dưới dạng JSON với header `Content-Type: application/json`.
