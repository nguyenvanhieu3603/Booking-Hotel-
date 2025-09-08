-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2025 at 10:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `hotelId` bigint(20) UNSIGNED NOT NULL,
  `roomId` bigint(20) UNSIGNED NOT NULL,
  `checkInDate` date NOT NULL,
  `checkOutDate` date NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `statusId` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `hotelId`, `roomId`, `checkInDate`, `checkOutDate`, `totalPrice`, `statusId`, `createdAt`) VALUES
(3, 15, 4, 40, '2025-06-01', '2025-06-07', 9900000.00, 'pending', '2025-05-28 00:13:02'),
(4, 15, 4, 32, '2025-06-01', '2025-06-07', 9900000.00, 'pending', '2025-05-28 00:19:05');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `description` text NOT NULL,
  `rating` float NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id`, `name`, `address`, `description`, `rating`, `active`, `created_at`) VALUES
(1, 'Hanoi Sunset Hotel', '45 Tran Phu, Hanoi', 'Khách sạn giá rẻ gần trung tâm thành phố.', 2.5, 0, '2025-05-23 03:09:03'),
(2, 'Lake View Inn', '23 Hoan Kiem, Hanoi', 'Tầm nhìn tuyệt đẹp ra hồ Hoàn Kiếm.', 3, 0, '2025-05-23 03:09:03'),
(3, 'Old Quarter Lodge', '78 Hang Bac, Hanoi', 'Phong cách truyền thống trong khu phố cổ.', 4, 0, '2025-05-23 03:09:03'),
(4, 'Budget Stay Hanoi', '120 Kim Ma, Hanoi', 'Lựa chọn lý tưởng cho khách du lịch tiết kiệm.', 1.5, 0, '2025-05-23 03:09:03'),
(5, 'Royal Garden Hotel', '5 Phan Dinh Phung, Hanoi', 'Khu nghỉ dưỡng sang trọng với vườn cây.', 5, 0, '2025-05-23 03:09:03'),
(6, 'City Inn', '98 Le Duan, Hanoi', 'Vị trí thuận tiện gần ga tàu.', 2, 0, '2025-05-23 03:09:03'),
(7, 'Hanoi Nights Hotel', '33 Nha Chung, Hanoi', 'Khung cảnh lãng mạn ở trung tâm Hà Nội.', 3.5, 0, '2025-05-23 03:09:03'),
(8, 'Peaceful Stay', '15 Cau Giay, Hanoi', 'Không gian yên tĩnh và dịch vụ thân thiện.', 4.2, 0, '2025-05-23 03:09:03'),
(9, 'Historic Charm Hotel', '62 Bat Dan, Hanoi', 'Khách sạn phong cách cổ điển với lịch sử phong phú.', 3.8, 0, '2025-05-23 03:09:03'),
(10, 'Riverside Comfort', '9 Yen Phu, Hanoi', 'Phòng thoải mái bên bờ sông.', 2.8, 0, '2025-05-23 03:09:03'),
(11, 'hotel 5 sao', 'Ha Noi', 'Ha Noi', 4, 0, '2025-05-23 03:34:57'),
(12, 'update_name', 'update_address', 'update_description', 4, 0, '2025-05-25 13:28:05'),
(13, 'update_name', 'update_address', 'update_description', 4, 0, '2025-05-25 13:27:45');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_images`
--

CREATE TABLE `hotel_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotel_images`
--

INSERT INTO `hotel_images` (`id`, `hotel_id`, `image_url`) VALUES
(1, 11, 'uploads/hotel/1747971297_blas_1.png'),
(2, 11, 'uploads/hotel/1747971297_blas_2.png'),
(3, 13, 'uploads/hotel/1748178036_bat.png'),
(4, 13, 'uploads/hotel/1748178036_ezgif-3-0d2c42f51c.jpg'),
(5, 13, 'uploads/hotel/1748181869_bat 2.png'),
(6, 13, 'uploads/hotel/1748189348_bat 2.png'),
(7, 12, 'uploads/hotel/1748189530_bat 2.png');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bookingId` bigint(20) UNSIGNED NOT NULL,
  `paymentMethod` enum('credit_card','bank_transfer','cash','ewallet') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `paidAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotelId` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `room_type` varchar(20) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `amenities` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `hotelId`, `name`, `room_type`, `price`, `amenities`, `created_at`) VALUES
(1, 1, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(2, 1, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(3, 1, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(4, 1, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(5, 1, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(6, 1, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(7, 1, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(8, 1, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(9, 1, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(10, 1, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(11, 2, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(12, 2, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(13, 2, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(14, 2, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(15, 2, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(16, 2, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(17, 2, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(18, 2, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(19, 2, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(20, 2, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(21, 3, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(22, 3, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(23, 3, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(24, 3, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(25, 3, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(26, 3, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(27, 3, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(28, 3, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(29, 3, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(30, 3, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(31, 4, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(32, 4, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(33, 4, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(34, 4, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(35, 4, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(36, 4, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(37, 4, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(38, 4, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(39, 4, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(40, 4, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(41, 5, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(42, 5, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(43, 5, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(44, 5, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(45, 5, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(46, 5, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(47, 5, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(48, 5, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(49, 5, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(50, 5, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(51, 6, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(52, 6, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(53, 6, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(54, 6, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(55, 6, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(56, 6, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(57, 6, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(58, 6, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(59, 6, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(60, 6, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(61, 7, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(62, 7, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(63, 7, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(64, 7, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(65, 7, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(66, 7, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(67, 7, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(68, 7, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(69, 7, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(70, 7, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(71, 8, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(72, 8, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(73, 8, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(74, 8, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(75, 8, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(76, 8, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(77, 8, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(78, 8, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(79, 8, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(80, 8, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(81, 9, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(82, 9, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(83, 9, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(84, 9, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(85, 9, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(86, 9, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(87, 9, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(88, 9, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(89, 9, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(90, 9, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(91, 10, 'P1001', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(92, 10, 'P1002', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(93, 10, 'P1003', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(94, 10, 'P1004', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(95, 10, 'P1005', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(96, 10, 'P1006', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(97, 10, 'P1007', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(98, 10, 'P1008', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(99, 10, 'P1009', 'Single', 1000000, 'Wi-Fi,TV,AC,Minibar', '2025-05-20 03:00:00'),
(100, 10, 'P1010', 'Double', 1500000, 'Wi-Fi,TV,AC', '2025-05-20 03:00:00'),
(101, 1, 'P2001', 'Single', 1000000, 'Wi-Fi,TV,AC', '2025-05-26 05:09:24'),
(102, 1, 'P2002', 'Single', 1000000, '', '2025-05-26 05:14:26');

-- --------------------------------------------------------

--
-- Table structure for table `room_images`
--

CREATE TABLE `room_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_images`
--

INSERT INTO `room_images` (`id`, `room_id`, `image_url`) VALUES
(1, 101, 'uploads/rooms/1748236164_ava.jpg'),
(3, 102, 'uploads/rooms/1748236466_ava.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `failed_login_attempts` int(11) DEFAULT 0,
  `lockout_until` datetime DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`, `phone`, `role`, `createdAt`, `is_verified`, `otp_code`, `otp_expires_at`, `failed_login_attempts`, `lockout_until`, `reset_token`, `reset_token_expires_at`) VALUES
(15, 'Trần Văn A', 'chubblinea@gmail.com', '$2y$10$W0i86WYAFwtgu9u4Ei3tLeZJudJLop7kMbStbqlmRymsO2e7zKWmC', '0987654321', 'admin', '2025-05-27 12:46:05', 1, NULL, NULL, 0, NULL, NULL, NULL),
(16, 'Nguyễn Văn A', 'chubblineb@gmail.com', '$2y$10$jY6hvj9SSqtNQXa7JaagpuIC6XZg5XrQl/Tv/DuxhX0rz9JmSn/j2', '0978654321', 'admin', '2025-05-27 13:29:49', 0, '420993', '2025-05-27 08:34:49', 0, NULL, NULL, NULL),
(17, 'Nguyễn Văn A', 'anhcaycaycay@gmail.com', '$2y$10$zfIONrW7Se6izTaFRwq2nOSOMIgxlapG4s7Ve6Y6Z8mb6VSI8TkPa', '0323456789', 'customer', '2025-05-27 18:26:43', 1, NULL, NULL, 0, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `hotelId` (`hotelId`),
  ADD KEY `roomId` (`roomId`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotel_images`
--
ALTER TABLE `hotel_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookingId` (`bookingId`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_ibfk_1` (`user_id`),
  ADD KEY `reviews_ibfk_2` (`hotel_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_room_name_per_hotel` (`hotelId`,`name`);

--
-- Indexes for table `room_images`
--
ALTER TABLE `room_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `hotel_images`
--
ALTER TABLE `hotel_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `room_images`
--
ALTER TABLE `room_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`hotelId`) REFERENCES `hotels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hotel_images`
--
ALTER TABLE `hotel_images`
  ADD CONSTRAINT `hotel_images_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `hotel_id` FOREIGN KEY (`hotelId`) REFERENCES `hotels` (`id`);

--
-- Constraints for table `room_images`
--
ALTER TABLE `room_images`
  ADD CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
