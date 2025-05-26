<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class BookingModel extends Database
{
    public function createBooking($userId, $hotelId, $roomId, $checkInDate, $checkOutDate, $totalPrice)
    {
        return $this->insert(
            "INSERT INTO bookings (userId, hotelId, roomId, checkInDate, checkOutDate, totalPrice) 
            VALUES (?, ?, ?, ?, ?, ?)",
            ["iiisss", $userId, $hotelId, $roomId, $checkInDate, $checkOutDate, $totalPrice]
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

    public function updateBookingStatus($bookingId, $status)
    {
        return $this->update(
            "UPDATE bookings SET status = ? WHERE id = ?",
            ["si", $status, $bookingId]
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
            AND b.status != 'cancelled'
            ORDER BY b.createdAt DESC
            LIMIT ?",
            ["ii", $userId, $limit]
        );
    }
    public function checkAvailability($hotelId, $checkInDate, $checkOutDate, $people)
    {
        $query = "SELECT *
        FROM rooms r
        WHERE r.hotelId = ?
        AND (? < 3 OR r.room_type = 'Double') 
        AND NOT EXISTS (
         SELECT 1
         FROM bookings b
         WHERE b.room_id = r.id
         AND b.check_in_date <= ?
         AND b.check_out_date >= ?
  );";
        return $this->select($query, [
            "iiss",
            $hotelId,
            $people,
            $checkOutDate,
            $checkInDate,
        ]);
    }
}
