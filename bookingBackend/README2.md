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
GET http://localhost/bookingBackend/api/hotel/list
```

Body (JSON):

```json
[
  {
    "id": 1,
    "name": "Hanoi Sunset Hotel",
    "address": "45 Tran Phu, Hanoi",
    "description": "Khách sạn giá rẻ gần trung tâm thành phố.",
    "rating": 2.5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 2,
    "name": "Lake View Inn",
    "address": "23 Hoan Kiem, Hanoi",
    "description": "Tầm nhìn tuyệt đẹp ra hồ Hoàn Kiếm.",
    "rating": 3,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 3,
    "name": "Old Quarter Lodge",
    "address": "78 Hang Bac, Hanoi",
    "description": "Phong cách truyền thống trong khu phố cổ.",
    "rating": 4,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 4,
    "name": "Budget Stay Hanoi",
    "address": "120 Kim Ma, Hanoi",
    "description": "Lựa chọn lý tưởng cho khách du lịch tiết kiệm.",
    "rating": 1.5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 5,
    "name": "Royal Garden Hotel",
    "address": "5 Phan Dinh Phung, Hanoi",
    "description": "Khu nghỉ dưỡng sang trọng với vườn cây.",
    "rating": 5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 6,
    "name": "City Inn",
    "address": "98 Le Duan, Hanoi",
    "description": "Vị trí thuận tiện gần ga tàu.",
    "rating": 2,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 7,
    "name": "Hanoi Nights Hotel",
    "address": "33 Nha Chung, Hanoi",
    "description": "Khung cảnh lãng mạn ở trung tâm Hà Nội.",
    "rating": 3.5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 8,
    "name": "Peaceful Stay",
    "address": "15 Cau Giay, Hanoi",
    "description": "Không gian yên tĩnh và dịch vụ thân thiện.",
    "rating": 4.2,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 9,
    "name": "Historic Charm Hotel",
    "address": "62 Bat Dan, Hanoi",
    "description": "Khách sạn phong cách cổ điển với lịch sử phong phú.",
    "rating": 3.8,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  }
]
```

#### Lấy danh sách khách sạn hoạt động theo tỉnh

```
GET http://localhost/bookingBackend/api/hotel/province?province=Hanoi
```

Query Parameters:

- `province`: tỉnh cần lấy danh sách khách sạn

```json
[
  {
    "id": 1,
    "name": "Hanoi Sunset Hotel",
    "address": "45 Tran Phu, Hanoi",
    "description": "Khách sạn giá rẻ gần trung tâm thành phố.",
    "rating": 2.5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 2,
    "name": "Lake View Inn",
    "address": "23 Hoan Kiem, Hanoi",
    "description": "Tầm nhìn tuyệt đẹp ra hồ Hoàn Kiếm.",
    "rating": 3,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 3,
    "name": "Old Quarter Lodge",
    "address": "78 Hang Bac, Hanoi",
    "description": "Phong cách truyền thống trong khu phố cổ.",
    "rating": 4,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  }
]
```

#### Lấy danh sách khách sạn hoạt động với bộ lọc đánh giá (tất cả các tỉnh)

```
GET http://localhost/bookingBackend/api/hotel/ratingFilter?rating=4
```

Query Parameters:

- `rating`: Đánh giá của khách sạn cần lấy thông tin

Body (JSON):

```json
[
  {
    "id": 3,
    "name": "Old Quarter Lodge",
    "address": "78 Hang Bac, Hanoi",
    "description": "Phong cách truyền thống trong khu phố cổ.",
    "rating": 4,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 5,
    "name": "Royal Garden Hotel",
    "address": "5 Phan Dinh Phung, Hanoi",
    "description": "Khu nghỉ dưỡng sang trọng với vườn cây.",
    "rating": 5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 8,
    "name": "Peaceful Stay",
    "address": "15 Cau Giay, Hanoi",
    "description": "Không gian yên tĩnh và dịch vụ thân thiện.",
    "rating": 4.2,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 11,
    "name": "hotel 5 sao",
    "address": "Ha Noi",
    "description": "Ha Noi",
    "rating": 4,
    "active": 0,
    "created_at": "2025-05-23 10:34:57",
    "images": ["uploads/hotel/default_hotel.png"]
  }
]
```

#### Lấy danh sách khách sạn hoạt động trong một tỉnh với bộ lọc đánh giá

```
GET http://localhost/bookingBackend/api/hotel/search?province=hanoi&rating=4
```

Query Parameters:

- `province`: tỉnh cần lấy danh sách khách sạn
- `rating`: Đánh giá của khách sạn cần lấy thông tin

Body (JSON):

```json
[
  {
    "id": 3,
    "name": "Old Quarter Lodge",
    "address": "78 Hang Bac, Hanoi",
    "description": "Phong cách truyền thống trong khu phố cổ.",
    "rating": 4,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 5,
    "name": "Royal Garden Hotel",
    "address": "5 Phan Dinh Phung, Hanoi",
    "description": "Khu nghỉ dưỡng sang trọng với vườn cây.",
    "rating": 5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 8,
    "name": "Peaceful Stay",
    "address": "15 Cau Giay, Hanoi",
    "description": "Không gian yên tĩnh và dịch vụ thân thiện.",
    "rating": 4.2,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"]
  },
  {
    "id": 13,
    "name": "update_name",
    "address": "update_address2, Hanoi",
    "description": "update_description",
    "rating": 4,
    "active": 0,
    "created_at": "2025-06-02 13:22:12",
    "images": ["uploads/hotel/default_hotel.png"]
  }
]
```

#### Xem chi tiết khách sạn

```
GET http://localhost/bookingBackend/api/hotel/get?id=1
```

Query Parameters:

- `id`: ID của khách sạn cần lấy thông tin

Body (JSON):

```json
{
  "id": 1,
  "name": "Hanoi Sunset Hotel",
  "address": "45 Tran Phu, Hanoi",
  "description": "Khách sạn giá rẻ gần trung tâm thành phố.",
  "rating": 2.5,
  "active": 0,
  "created_at": "2025-05-23 10:09:03",
  "images": ["uploads/hotel/default_hotel.png"]
}
```

### Quản lý khách sạn (Admin)

#### Xem tất cả khách sạn và phòng

```
GET http://localhost/bookingBackend/api/hotel/all
```

Body return (JSON):

```json
[
  {
    "id": 1,
    "name": "Hanoi Sunset Hotel",
    "address": "45 Tran Phu, Hanoi",
    "description": "Khách sạn giá rẻ gần trung tâm thành phố.",
    "rating": 2.5,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"],
    "rooms": [
      {
        "id": 1,
        "hotelId": 1,
        "name": "P1001",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 2,
        "hotelId": 1,
        "name": "P1002",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 3,
        "hotelId": 1,
        "name": "P1003",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 4,
        "hotelId": 1,
        "name": "P1004",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 5,
        "hotelId": 1,
        "name": "P1005",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 6,
        "hotelId": 1,
        "name": "P1006",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 7,
        "hotelId": 1,
        "name": "P1007",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 8,
        "hotelId": 1,
        "name": "P1008",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 9,
        "hotelId": 1,
        "name": "P1009",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 10,
        "hotelId": 1,
        "name": "P1010",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 101,
        "hotelId": 1,
        "name": "P2001",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-26 12:09:24",
        "images": ["uploads/rooms/1748236164_ava.jpg"]
      },
      {
        "id": 102,
        "hotelId": 1,
        "name": "P2002",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "",
        "created_at": "2025-05-26 12:14:26",
        "images": ["uploads/rooms/1748236466_ava.jpg"]
      }
    ]
  },
  {
    "id": 2,
    "name": "Lake View Inn",
    "address": "23 Hoan Kiem, Hanoi",
    "description": "Tầm nhìn tuyệt đẹp ra hồ Hoàn Kiếm.",
    "rating": 3,
    "active": 0,
    "created_at": "2025-05-23 10:09:03",
    "images": ["uploads/hotel/default_hotel.png"],
    "rooms": [
      {
        "id": 11,
        "hotelId": 2,
        "name": "P1001",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 12,
        "hotelId": 2,
        "name": "P1002",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 13,
        "hotelId": 2,
        "name": "P1003",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 14,
        "hotelId": 2,
        "name": "P1004",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 15,
        "hotelId": 2,
        "name": "P1005",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 16,
        "hotelId": 2,
        "name": "P1006",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 17,
        "hotelId": 2,
        "name": "P1007",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 18,
        "hotelId": 2,
        "name": "P1008",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 19,
        "hotelId": 2,
        "name": "P1009",
        "room_type": "Single",
        "price": "1000000",
        "amenities": "Wi-Fi,TV,AC,Minibar",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      },
      {
        "id": 20,
        "hotelId": 2,
        "name": "P1010",
        "room_type": "Double",
        "price": "1500000",
        "amenities": "Wi-Fi,TV,AC",
        "created_at": "2025-05-20 10:00:00",
        "images": ["uploads/room/default_room.png"]
      }
    ]
  }
]
```

#### Đếm số khách sạn trong 1 tỉnh

```
GET http://localhost/bookingBackend/api/hotel/provinceCount?province=Hanoi
```

Query Parameters:

- `province`: tỉnh cần đếm khách sạn

Body return (JSON):

```json (sai lệch do khác CSDL)
{
  "count": 11
}
```

#### Tạo khách sạn

```
POST http://localhost/bookingBackend/api/hotel/create
```

Body return (JSON):

```json
{
  "id": "hotel id",
  "images": ["image_link", "image_link"],
  "message": "Hotel created successfully"
}
```

content-type: multipart/form-data

Body sent (form-data) :

```
| Key           | Type     | Required  Value                                   |
| ------------- | -------- | -------- | ---------------------------------------|
| `name`        | `text`   |   Yes    | Name of the hotel                      |
| `road`        | `text`   |   Yes    | Road address of the hotel              |
| `province`    | `text`   |   Yes    | Hanoi/Danang/...                       |
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
POST http://localhost/bookingBackend/api/hotel/update?id=13
```

content-type: multipart/form-data

Query Parameters:

- `id`: ID của khách sạn cần chuyển trạng thái

Body sent (form-data) :

```
| Key                   | Type     | Required | Value                                          |
| -------------         | -------- | -------- | ---------------------------------------        |
| `name`                | `text`   |   Yes    | Update_name                                    |
| `road`                | `text`   |   Yes    | Road address of the hotel                      |
| `province`            | `text`   |   Yes    | Hanoi/Danang/...                               |
| `description`         | `text`   |   No     | Description                                    |
| `rating`              | `text`   |   No     | 4                                              |
| `images[]`            | `file`   |   No     | Image files added(optional uploads)            |
| `deleted_images[]`    | `file`   |   No     | Image files link(lấy link từ file uploads)     |
```

Body return (JSON): (cái này t xóa ảnh rồi nen tùy dữ liệu trên máy )

```json
{
  "message": "Hotel updated successfully",
  "images_added": ["uploads/hotel/image_link"],
  "images_deleted": ["uploads/hotel/image_link"]
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
GET http://localhost/bookingBackend/api/room/list?hotelId=1
```

Query Parameters:

- `id`: ID của khách sạn cần lấy danh sách phòng

Body return (JSON):

```json
[
  {
    "id": 1,
    "hotelId": 1,
    "name": "P1001",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 2,
    "hotelId": 1,
    "name": "P1002",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 3,
    "hotelId": 1,
    "name": "P1003",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 4,
    "hotelId": 1,
    "name": "P1004",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 5,
    "hotelId": 1,
    "name": "P1005",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 6,
    "hotelId": 1,
    "name": "P1006",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 7,
    "hotelId": 1,
    "name": "P1007",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 8,
    "hotelId": 1,
    "name": "P1008",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 9,
    "hotelId": 1,
    "name": "P1009",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 10,
    "hotelId": 1,
    "name": "P1010",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 101,
    "hotelId": 1,
    "name": "P2001",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-26 12:09:24",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 102,
    "hotelId": 1,
    "name": "P2002",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "",
    "created_at": "2025-05-26 12:14:26",
    "images": ["uploads/room/default_room.png"]
  }
]
```

#### Sửa phòng theo id (Admin)

```
POST http://localhost/bookingBackend/api/room/update/?hotelId=1&roomId=101
```

content-type: multipart/form-data

Query Parameters:

- `hotelId` = id khách sạn
- `roomId` = id phòng

Body sent (form-data) :

```
| Key                   | Type     | Required | Value                                          |
| -------------         | -------- | -------- | ---------------------------------------        |
| `name`                | `text`   |   Yes    | Update name                                    |
| `roomType`            | `text`   |   Yes    | Roomtype ("Single","Double")                   |
| `price`               | `text`   |   Yes    | Room price                                     |
| `amenities`           | `text`   |   No     | Room amenities                                 |
| `images[]`            | `file`   |   No     | Image files added(optional uploads)            |
| `deleted_images[]`    | `file`   |   No     | Image files link(lấy link từ file uploads)     |
```

Body return (JSON): (cái này t xóa ảnh rồi nen tùy dữ liệu trên máy )

```json
{
  "message": "Hotel updated successfully",
  "id": "101",
  "images_added": ["uploads/rooms/image_link"],
  "images_deleted": ["uploads/rooms/image_link"]
}
```

### Lấy danh sách phòng trống theo thời gian nhập

```
GET http://localhost/bookingBackend/api/room/available?hotelId=1&people=1&checkInDate=2025-06-06&checkOutDate=2025-06-24
```

Query Parameters:

- `hotelId` = id khách sạn
- `roomId` = id phòng
- `people` = số người
- `checkInDate` = ngày nhận phòng
- `checkOutDate` = ngày trả phòng

Giả sử bảng bookings có data

```json
{
  "id": 1,
  "user_id": 1,
  "room_id": 1,
  "check_in_date": "2025-05-06",
  "check_out_date": "2025-05-23",
  "total_price": 100000,
  "status": "In progress",
  "create_at": "2025-05-26 20:22:44"
}
```

Body return (JSON):

```json
[
  {
    "id": 2,
    "hotelId": 1,
    "name": "P1002",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 3,
    "hotelId": 1,
    "name": "P1003",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 4,
    "hotelId": 1,
    "name": "P1004",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 5,
    "hotelId": 1,
    "name": "P1005",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 6,
    "hotelId": 1,
    "name": "P1006",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 7,
    "hotelId": 1,
    "name": "P1007",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 8,
    "hotelId": 1,
    "name": "P1008",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 9,
    "hotelId": 1,
    "name": "P1009",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC,Minibar",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 10,
    "hotelId": 1,
    "name": "P1010",
    "room_type": "Double",
    "price": "1500000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-20 10:00:00",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 101,
    "hotelId": 1,
    "name": "P2001",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "Wi-Fi,TV,AC",
    "created_at": "2025-05-26 12:09:24",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 102,
    "hotelId": 1,
    "name": "P2002",
    "room_type": "Single",
    "price": "1000000",
    "amenities": "",
    "created_at": "2025-05-26 12:14:26",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 113,
    "hotelId": 1,
    "name": "P2003",
    "room_type": "Single",
    "price": "1",
    "amenities": "",
    "created_at": "2025-05-28 12:07:41",
    "images": ["uploads/room/default_room.png"]
  },
  {
    "id": 114,
    "hotelId": 1,
    "name": "P2004",
    "room_type": "Single",
    "price": "1",
    "amenities": "",
    "created_at": "2025-05-28 12:24:16",
    "images": ["uploads/room/default_room.png"]
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
