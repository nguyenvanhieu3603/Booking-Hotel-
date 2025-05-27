<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class RoomModel extends Database
{
    public function getRoomsByHotel($hotelId, $limit = 10)
    {
        return $this->select(
            "SELECT * FROM rooms WHERE hotelId = ? ORDER BY id ASC LIMIT ?",
            ["ii", $hotelId, $limit]
        );
    }

    public function getRoomById($roomId)
    {
        return $this->select("SELECT * FROM rooms WHERE id = ?", ["i", $roomId]);
    }

    public function createRoom($hotelId, $name, $roomType, $price, $quantity, $amenities = null)
    {
        return $this->insert(
            "INSERT INTO rooms (hotelId, name, roomType, price, quantity, amenities) VALUES (?, ?, ?, ?, ?, ?)",
            ["issdis", $hotelId, $name, $roomType, $price, $quantity, $amenities]
        );
    }

    public function updateRoom($roomId, $name, $roomType, $price, $quantity, $amenities)
    {
        return $this->update(
            "UPDATE rooms SET name = ?, roomType = ?, price = ?, quantity = ?, amenities = ? WHERE id = ?",
            ["ssdiss", $name, $roomType, $price, $quantity, $amenities, $roomId]
        );
    }

    public function deleteRoom($roomId)
    {
        return $this->delete("DELETE FROM rooms WHERE id = ?", ["i", $roomId]);
    }

    public function checkAvailability($roomId, $checkInDate, $checkOutDate)
    {
        // Logic kiểm tra phòng có sẵn trong khoảng thời gian
        // Giả sử chúng ta có bảng bookings (sẽ triển khai sau)
        $query = "SELECT quantity - IFNULL((
            SELECT SUM(quantity) 
            FROM bookings 
            WHERE roomId = ? 
            AND (
                (checkInDate BETWEEN ? AND ?)
                OR (checkOutDate BETWEEN ? AND ?)
                OR (checkInDate <= ? AND checkOutDate >= ?)
            )
            AND statusId != 'cancelled'
        ), 0) AS available 
        FROM rooms WHERE id = ?";
        
        return $this->select($query, [
            "issssssi", 
            $roomId, 
            $checkInDate, $checkOutDate,
            $checkInDate, $checkOutDate,
            $checkInDate, $checkOutDate,
            $roomId
        ]);
    }
}