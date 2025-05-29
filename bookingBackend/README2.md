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

### Quản lý khách sạn (User)

#### Lấy danh sách khách sạn hoạt động

```
GET http://localhost/bookingBackend/api/hotel/list?limit=10
```

Body (JSON):

```json
[
  {
    "id": "hotel_id",
    "name": "hotel_name",
    "address": "hotel_address",
    "description": "hotel_description",
    "rating": "hotel_rating",
    "active": "hotel_status",
    "created_at": "hotel_create_date",
    "images": ["image_link"]
  },
  {
    "id": "hotel_id",
    "name": "hotel_name",
    "address": "hotel_address",
    "description": "hotel_description",
    "rating": "hotel_rating",
    "active": "hotel_status",
    "created_at": "hotel_create_date",
    "images": ["image_link"]
  }
]
```

#### Xem chi tiết khách sạn

```
GET http://localhost/bookingBackend/api/hotel/get?id={Hotel_id}
```

Query Parameters:

- `id`: ID của khách sạn cần lấy thông tin

Body (JSON):

```json
{
  "id": "hotel_id",
  "name": "hotel_name",
  "address": "hotel_address",
  "description": "hotel_description",
  "rating": "hotel_rating",
  "active": "hotel_status",
  "created_at": "hotel_create_date",
  "images": ["hotel_image_links"]
}
```

### Quản lý khách sạn (Admin)

#### Tạo khách sạn

```
POST http://localhost/bookingBackend/api/hotel/create
```

content-type: multipart/form-data

Body sent (form-data) :

```
| Key           | Type     | Required | Value                                  |
| ------------- | -------- | -------- | ---------------------------------------|
| `name`        | `text`   |   Yes    | Name of the hotel                      |
| `address`     | `text`   |   Yes    | Address of the hotel                   |
| `description` | `text`   |   No     | Description of the hotel               |
| `rating`      | `text`   |   No     | Rating (0.0 - 5.0)                     |
| `images[]`    | `file`   |   No     | Image files (optional uploads)         |
| `images[]`    | `file`   |   No     | Image files (optional uploads)         |
```

Body return (JSON):

```json
{
  "id": "hotel id",
  "images": ["image_link", "image_link"],
  "message": "Hotel created successfully"
}
```

#### Xóa/Ẩn khách sạn

```
GET http://localhost/bookingBackend/api/hotel/delete?id={hotel_id}
```

Query Parameters:

- `id`: ID của khách sạn cần chuyển trạng thái

Body return (JSON):

```json
{
  "message": "Hotel removed from active list successfully"
}
```

#### Sửa khách sạn

```
POST http://localhost/bookingBackend/api/hotel/update
```

content-type: multipart/form-data

Body sent (form-data) :

```
| Key           | Type     | Required | Value                                  |
| ------------- | -------- | -------- | ---------------------------------------|
| `name`        | `text`   |   Yes    | Name of the hotel                      |
| `address`     | `text`   |   Yes    | Address of the hotel                   |
| `description` | `text`   |   No     | Description of the hotel               |
| `rating`      | `text`   |   No     | Rating (0.0 - 5.0)                     |
| `images[]`    | `file`   |   No     | Image files added(optional uploads)    |
```

Body return (JSON):

```json
{
  "message": "Hotel updated successfully",
  "images_added": ["image_link"]
}
```

### Quản lý phòng (Admin)

#### Tạo phòng (Admin)

```
POST http://localhost/bookingBackend/api/room/create
```

content-type: multipart/form-data

Body sent (form-data) :

```
| Key           | Type     | Required | Value                                  |
| ------------- | -------- | -------- | ---------------------------------------|
| `hotelId`     | `text`   |   Yes    | Id of the hotel                        |
| `name`        | `text`   |   Yes    | Name of the hotel                      |
| `roomType`    | `text`   |   Yes    | Roomtype ("Single","Double")           |
| `price`       | `text`   |   Yes    | Room price                             |
| `amenities`   | `text`   |   No     | Room amenities                         |
| `images[]`    | `file`   |   No     | Image files added(optional uploads)    |
```

Body return (JSON):

```json
{
  "id": "room_id",
  "images": ["image_link"],
  "message": "Room created successfully"
}
```

Body return exception :

- `price` is null or not numeric

```json
{
  "error": "Price must be numeric values"
}
```

- `price` is numeric and < 0

```json
{
  "error": "Quantity must be greater than zero"
}
```

- room `name` already exists in `hotelId`

```json
{
  "error": "A room with this name already exists for this hotel."
}
```

- `hotelId`, `name`, `roomType`, `price` empty

```json
{
  "error": "Missing required fields: hotelId, name, roomType, price"
}
```

#### Lấy danh sách phòng (Admin)

```
GET http://localhost/bookingBackend/api/room/list?hotelId={hotel_id}
```

Query Parameters:

- `id`: ID của khách sạn cần lấy danh sách phòng

Body return (JSON):

```json
[
  {
    "id": "room_id",
    "hotelId": "hotel_id",
    "name": "room_name",
    "room_type": "room_type",
    "price": "price",
    "amenities": "amenities",
    "created_at": "created_at"
  }
]
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
├── uploads/
│   ├── hotel/(Ảnh khách sạn)
|   └── rooms/(Ảnh phòng)
├── index.php
└── README.md
```
