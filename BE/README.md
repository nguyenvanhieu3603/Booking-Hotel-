# Hotel Booking System API

Hệ thống API quản lý đặt phòng khách sạn được xây dựng trên nền tảng PHP.

## Yêu cầu hệ thống

- [XAMPP](https://www.apachefriends.org/download.html) (Apache, MySQL, PHP)
- [Composer](https://getcomposer.org/download/) để quản lý các dependency PHP
- PHPMailer (để gửi email OTP và thông báo)

## Cài đặt

1. Clone hoặc download source code vào thư mục `htdocs` của XAMPP:

   ```
   C:\xampp\htdocs\bookingBackend\
   ```

2. Tạo database trong phpMyAdmin:

   - Mở Xamp,bật Apache và MySQLMySQL
   - Truy cập http://localhost/phpmyadmin
   - Tạo database mới với tên `hotel_booking`
   - Import file hotel_booking.sql vào database

3. Cài đặt PHPMailer thông qua Composer:

   ```
   cd C:\xampp\htdocs\bookingBackend\inc
   composer require phpmailer/phpmailer
   ```

4. Cấu hình file `inc/config.php` với thông tin database của bạn:

   ```php
   define("DB_HOST", "localhost");
   define("DB_USERNAME", "root");
   define("DB_PASSWORD", "");
   define("DB_DATABASE_NAME", "hotel_booking");
   define("JWT_SECRET", "your_secret_key_here");
   ```

5. Cấu hình email trong file `inc/EmailService.php` để gửi OTP và thông báo:

   ```php
   $this->mailer->Username = 'your_email@gmail.com';
   $this->mailer->Password = 'your_app_password'; // Có thể giữ nguyên Email ban đầu cũng được
   ```

6. Truy vấn API

## Danh sách API

### Quản lý người dùng (User)

#### Lấy danh sách người dùng

```
GET http://localhost/bookingBackend/api/user/list
```

Query Parameters:

- `limit`: Số lượng user tối đa muốn lấy (mặc định: 10)

#### Đăng ký tài khoản

```
POST http://localhost/bookingBackend/api/user/register
```

Body (JSON):

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "example@gmail.com",
  "password": "Password123",
  "phone": "0123456789"
}
```

#### Đăng nhập

```
POST http://localhost/bookingBackend/api/user/login
```

Body (JSON):

```json
{
  "email": "example@gmail.com",
  "password": "Password123"
}
```

#### Lấy thông tin người dùng

```
GET http://localhost/bookingBackend/api/user/profile?id=1
```

Query Parameters:

- `id`: ID của người dùng cần lấy thông tin

### Quản lý OTP

#### Gửi mã OTP

```
POST http://localhost/bookingBackend/api/otp/send
```

Body (JSON):

```json
{
  "email": "example@gmail.com"
}
```

#### Xác thực OTP

```
POST http://localhost/bookingBackend/api/otp/verify
```

Body (JSON):

```json
{
  "email": "example@gmail.com",
  "otp": "123456"
}
```

## Cấu trúc dự án

```
bookingBackend/
├── Controller/
│   └── Api/
│       ├── BaseController.php
│       ├── UserController.php
│       ├── OTPController.php
│       └── ...
├── Model/
│   ├── Database.php
│   ├── UserModel.php
│   ├── HotelModel.php
│   ├── RoomModel.php
│   ├── BookingModel.php
│   ├── PaymentModel.php
│   └── ReviewModel.php
├── inc/
│   ├── bootstrap.php
│   ├── config.php
│   ├── cors.php
│   └── EmailService.php
├── vendor/
│   └── ... (thư viện Composer)
├── index.php
└── README.md
```
