<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class BookingModel extends Database
{
    private function isValidDate($date)
    {
        return (bool)strtotime($date) && DateTime::createFromFormat('Y-m-d', $date) !== false;
    }

    public function createBooking($userId, $hotelId, $roomId, $checkInDate, $checkOutDate, $quantity = 1)
    {
        // Kiểm tra định dạng ngày
        if (!$this->isValidDate($checkInDate) || !$this->isValidDate($checkOutDate)) {
            throw new Exception("Invalid date format");
        }

        // Kiểm tra ngày ra lớn hơn ngày vào
        $checkIn = new DateTime($checkInDate);
        $checkOut = new DateTime($checkOutDate);
        if ($checkIn >= $checkOut) {
            throw new Exception("Check-out date must be after check-in date");
        }

        // Kiểm tra số lượng phòng
        if ($quantity < 1) {
            throw new Exception("Quantity must be at least 1");
        }
        $availability = $this->checkRoomAvailability($roomId, $checkInDate, $checkOutDate);
        if (empty($availability) || $availability[0]['available'] < $quantity) {
            throw new Exception("Not enough rooms available");
        }

        // Lấy giá phòng từ bảng rooms
        $room = $this->select("SELECT price FROM rooms WHERE id = ?", ["i", $roomId]);
        if (empty($room)) {
            throw new Exception("Room not found");
        }
        $pricePerNight = $room[0]['price'];

        // Tính số đêm
        $nights = $checkIn->diff($checkOut)->days;

        // Tính tổng giá (giả sử thuế 10%)
        $roomPrice = $pricePerNight * $nights * $quantity;
        $taxPrice = $roomPrice * 0.1;
        $totalPrice = $roomPrice + $taxPrice;

        return $this->insert(
            "INSERT INTO bookings (userId, hotelId, roomId, checkInDate, checkOutDate, totalPrice, quantity) 
            VALUES (?, ?, ?, ?, ?, ?, ?)",
            ["iiissdi", $userId, $hotelId, $roomId, $checkInDate, $checkOutDate, $totalPrice, $quantity]
        );
    }

    public function getBookingById($bookingId)
    {
        return $this->select(
            "SELECT b.*, h.name as hotelName, r.name as roomName 
            FROM bookings b
            JOIN hotels h ON b.hotelId = h.id
            JOIN rooms r ON b.roomId = r.id
            WHERE b.id = ?",
            ["i", $bookingId]
        );
    }

    public function getUserBookings($userId, $limit = 10)
    {
        return $this->select(
            "SELECT b.*, h.name as hotelName, r.name as roomName 
            FROM bookings b
            JOIN hotels h ON b.hotelId = h.id
            JOIN rooms r ON b.roomId = r.id
            WHERE b.userId = ?
            ORDER BY b.createdAt DESC
            LIMIT ?",
            ["ii", $userId, $limit]
        );
    }

    public function updateBookingStatus($bookingId, $statusId)
    {
        $booking = $this->getBookingById($bookingId);
        if (empty($booking)) {
            throw new Exception("Booking not found");
        }
        if ($booking[0]['statusId'] === 'completed') {
            throw new Exception("Cannot modify completed booking");
        }
        $validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!in_array($statusId, $validStatuses)) {
            throw new Exception("Invalid booking status");
        }
        return $this->update(
            "UPDATE bookings SET statusId = ? WHERE id = ?",
            ["si", $statusId, $bookingId]
        );
    }

    public function getUserActiveBookings($userId, $limit = 10)
    {
        return $this->select(
            "SELECT b.*, h.name as hotelName, r.name as roomName 
            FROM bookings b
            JOIN hotels h ON b.hotelId = h.id
            JOIN rooms r ON b.roomId = r.id
            WHERE b.userId = ?
            AND b.statusId != 'cancelled'
            ORDER BY b.createdAt DESC
            LIMIT ?",
            ["ii", $userId, $limit]
        );
    }

    public function checkRoomAvailability($roomId, $checkInDate, $checkOutDate)
    {
        $query = "SELECT r.quantity - IFNULL((
            SELECT SUM(b.quantity) 
            FROM bookings b 
            WHERE b.roomId = ? 
            AND b.statusId != 'cancelled'
            AND (
                (b.checkInDate BETWEEN ? AND ?)
                OR (b.checkOutDate BETWEEN ? AND ?)
                OR (b.checkInDate <= ? AND b.checkOutDate >= ?)
            )
        ), 0) AS available
        FROM rooms r 
        WHERE r.id = ?";
        
        return $this->select($query, [
            "issssssi", 
            $roomId, $checkInDate, $checkOutDate, 
            $checkInDate, $checkOutDate, 
            $checkInDate, $checkOutDate, 
            $roomId
        ]);
    }
    public function getAllBookings($limit = 10)
    {
        return $this->select(
            "SELECT b.*, u.fullName as userName, h.name as hotelName, r.name as roomName 
            FROM bookings b
            JOIN users u ON b.userId = u.id
            JOIN hotels h ON b.hotelId = h.id
            JOIN rooms r ON b.roomId = r.id
            ORDER BY b.createdAt DESC
            LIMIT ?",
            ["i", $limit]
        );
    }

    public function countTotalBookings()
    {
        $result = $this->select("SELECT COUNT(*) as total FROM bookings");
        return $result[0]['total'] ?? 0;
    }

    public function calculateTotalRevenue()
    {
        $result = $this->select(
            "SELECT SUM(totalPrice) as revenue 
            FROM bookings 
            WHERE statusId = 'confirmed' OR statusId = 'completed'"
        );
        return $result[0]['revenue'] ?? 0;
    }

    public function calculateRevenueByDate()
    {
        return $this->select(
            "SELECT DATE(createdAt) as date, SUM(totalPrice) as dailyRevenue
            FROM bookings
            WHERE statusId = 'confirmed' OR statusId = 'completed'
            GROUP BY DATE(createdAt)
            ORDER BY DATE(createdAt) DESC"
        );
    }

    public function markAsCompleted($bookingId)
    {
        $booking = $this->getBookingById($bookingId);
        if (empty($booking)) {
            throw new Exception("Booking not found");
        }
        if ($booking[0]['statusId'] !== 'confirmed') {
            throw new Exception("Only confirmed bookings can be marked as completed");
        }
        
        return $this->update(
            "UPDATE bookings SET statusId = 'completed' WHERE id = ?",
            ["i", $bookingId]
        );
    }
    public function checkAvailability($hotelId, $checkInDate, $checkOutDate, $people)
    {
        $query = "SELECT *
        FROM rooms r
        WHERE r.hotelId = ?
        AND NOT EXISTS (
         SELECT 1
         FROM bookings b
         WHERE b.room_id = r.id
         AND b.check_in_date <= ?
         AND b.check_out_date >= ?
  );";
        return $this->select($query, [
            "iss",
            $hotelId,
            $checkOutDate,
            $checkInDate,
        ]);
    }
}