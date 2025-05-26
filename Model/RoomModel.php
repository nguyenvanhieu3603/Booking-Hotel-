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

    public function createRoom($hotelId, $name, $roomType, $price, $amenities = null)
    {
        return $this->insert(
            "INSERT INTO rooms (hotelId, name, room_type, price, amenities) VALUES (?, ?, ?, ?, ?, ?)",
            ["issdis", $hotelId, $name, $roomType, $price, $amenities]
        );
    }

    public function updateRoom($roomId, $name, $roomType, $price, $amenities)
    {
        return $this->update(
            "UPDATE rooms SET name = ?, roomType = ?, price = ?, amenities = ? WHERE id = ?",
            ["ssdiss", $name, $roomType, $price, $amenities, $roomId]
        );
    }

    public function deleteRoom($roomId)
    {
        return $this->delete("DELETE FROM rooms WHERE id = ?", ["i", $roomId]);
    }

    
    public function addRoomImage($roomId, $imagePath)
    {
        return $this->insert(
            "INSERT INTO room_images (room_id, image_url) VALUES (?, ?)",
            ["is", $roomId, $imagePath]
        );
    }

    public function isRoomNameExists($hotelId, $roomName)
    {
        $result = $this->select(
            "SELECT COUNT(*) as count FROM rooms WHERE hotelId = ? AND name = ?",
            ['is', $hotelId, $roomName]
        );
        return $result[0]['count'] > 0;
    }
}
