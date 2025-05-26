-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 23, 2025 lúc 05:10 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hotel_booking`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `hotelId` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `room_type` varchar(20) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `quantity` int(11) NOT NULL,
  `amenities` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `hotelId`, `name`, `room_type`, `price`, `quantity`, `amenities`, `created_at`) VALUES
(1, 1, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(2, 1, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(3, 1, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(4, 1, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(5, 1, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(6, 1, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(7, 1, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(8, 1, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(9, 1, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(10, 1, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(11, 2, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(12, 2, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(13, 2, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(14, 2, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(15, 2, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(16, 2, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(17, 2, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(18, 2, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(19, 2, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(20, 2, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(21, 3, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(22, 3, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(23, 3, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(24, 3, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(25, 3, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(26, 3, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(27, 3, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(28, 3, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(29, 3, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(30, 3, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(31, 4, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(32, 4, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(33, 4, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(34, 4, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(35, 4, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(36, 4, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(37, 4, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(38, 4, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(39, 4, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(40, 4, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(41, 5, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(42, 5, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(43, 5, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(44, 5, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(45, 5, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(46, 5, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(47, 5, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(48, 5, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(49, 5, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(50, 5, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(51, 6, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(52, 6, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(53, 6, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(54, 6, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(55, 6, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(56, 6, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(57, 6, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(58, 6, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(59, 6, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(60, 6, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(61, 7, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(62, 7, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(63, 7, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(64, 7, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(65, 7, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(66, 7, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(67, 7, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(68, 7, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(69, 7, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(70, 7, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(71, 8, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(72, 8, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(73, 8, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(74, 8, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(75, 8, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(76, 8, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(77, 8, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(78, 8, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(79, 8, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(80, 8, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(81, 9, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(82, 9, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(83, 9, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(84, 9, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(85, 9, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(86, 9, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(87, 9, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(88, 9, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(89, 9, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(90, 9, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(91, 10, 'P1001', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(92, 10, 'P1002', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(93, 10, 'P1003', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(94, 10, 'P1004', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(95, 10, 'P1005', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(96, 10, 'P1006', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(97, 10, 'P1007', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(98, 10, 'P1008', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(99, 10, 'P1009', 'Single', 1000000, 1, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(100, 10, 'P1010', 'Double', 1500000, 2, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hotel_id` (`hotelId`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `hotel_id` FOREIGN KEY (`hotelId`) REFERENCES `hotels` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
