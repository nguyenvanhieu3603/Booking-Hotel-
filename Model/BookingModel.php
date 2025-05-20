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
    public function checkRoomAvailability($roomId, $checkInDate, $checkOutDate)
    {
        return $this->select(
            "SELECT r.quantity - IFNULL((
                SELECT COUNT(*) 
                FROM bookings b 
                WHERE b.roomId = ? 
                AND b.status != 'cancelled'
                AND (
                    (b.checkInDate BETWEEN ? AND ?)
                    OR (b.checkOutDate BETWEEN ? AND ?)
                    OR (b.checkInDate <= ? AND b.checkOutDate >= ?)
                )
            ), 0) AS available
            FROM rooms r
            WHERE r.id = ?",
            ["issssssi", $roomId, $checkInDate, $checkOutDate, $checkInDate, $checkOutDate, 
            $checkInDate, $checkOutDate, $roomId]
        );
    }
}